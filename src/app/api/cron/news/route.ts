import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { validateNewsArticle, calculateReadingTime, validateContentDepth, NewsArticlesBatchSchema } from "@/lib/contentValidator";

// Allow execution for up to 60 seconds on serverless environments
export const maxDuration = 60;

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") +
    `-${Date.now().toString().slice(-4)}`;
};

export async function GET(request: Request) {
  // 1. AUTHENTICATION CHECK
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized: Invalid Cron Secret", { status: 401 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing Gemini API Key" },
      { status: 500 }
    );
  }

  // 2. STRUCTURED PROMPT FOR LONG-FORM EDITORIAL GENERATION
  const prompt = `You are the Lead Senior Editor for Beacon-Hub, an international flagship news intelligence platform.
Generate 5 comprehensive, full-length breaking news articles across these categories (exactly one per category):
- Politics
- Technology 
- Finance
- Lifestyle
- Sports

CRITICAL EDITORIAL REQUIREMENTS:
1. FULL STORY EXPANSION: Do NOT write short 2 or 3 line summaries. You must write complete, deeply reported, long-form journalistic articles. Each article MUST be a minimum of 500 words, structured into at least 4 to 6 detailed paragraphs.
2. ANALYTICAL DEPTH: Provide rich context, historical background, analytical breakdowns, and future outlooks.
3. HTML FORMATTING: Include at least three descriptive <h2> section headers inside the "content" string to divide the narrative logically. Use <p> tags for paragraphs.
4. BRAND ATTRIBUTION: NEVER mention AI models (like Gemini), and NEVER use conversational filler (e.g., "Here is the article"). Attribute reporting strictly to the respective Beacon-Hub desk.

Return a JSON array where each object matches EXACTLY this structure:
{
  "title": "Commanding, professional headline (10-200 characters)",
  "excerpt": "A tight 2-3 sentence executive summary (50-300 characters)",
  "content": "Full, un-cut article text formatted with <h2> and <p> tags (minimum 500 words)",
  "category": "One of: politics, tech, finance, lifestyle, sports",
  "keywordTags": ["keyword1", "keyword2", "keyword3"],
  "authorPerspective": "One of: Beacon-Hub Politics Desk, Beacon-Hub Tech Lab, Beacon-Hub Finance Markets, Beacon-Hub Lifestyle & Culture, Beacon-Hub Sports Analysis",
  "coverImage": "https://images.unsplash.com/...",
  "estimatedReadTime": 5,
  "metaDescription": "Optimized SEO meta description (50-160 characters)"
}

RETURN ONLY A VALID JSON ARRAY. NO MARKDOWN WRAPPERS, NO BACKTICKS, NO COMMENTARY.`;

  try {
    // 3. CALL GEMINI API WITH STRUCTURED JSON CONFIGURATION
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.3, // Low temperature maintains journalistic objectivity
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  excerpt: { type: "STRING" },
                  content: { type: "STRING" },
                  category: { type: "STRING", enum: ["politics", "tech", "finance", "lifestyle", "sports"] },
                  keywordTags: { type: "ARRAY", items: { type: "STRING" } },
                  authorPerspective: { type: "STRING" },
                  coverImage: { type: "STRING" },
                  estimatedReadTime: { type: "NUMBER" },
                  metaDescription: { type: "STRING" },
                },
                required: ["title", "excerpt", "content", "category", "keywordTags", "authorPerspective", "estimatedReadTime", "metaDescription"]
              },
            },
          },
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json(
        { error: "Gemini API error", details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return NextResponse.json(
        { error: "Empty response from Gemini engine" },
        { status: 500 }
      );
    }

    // 4. PARSE AND VALIDATE GENERATED PAYLOAD
    let aiArticles;
    try {
      aiArticles = JSON.parse(textResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse Gemini response as JSON" },
        { status: 500 }
      );
    }

    if (!Array.isArray(aiArticles)) {
      aiArticles = [aiArticles];
    }

    // 5. PROCESS VALIDATED ARTICLES
    const validatedArticles = [];
    const errors = [];

    for (let i = 0; i < aiArticles.length; i++) {
      const article = aiArticles[i];

      const validation = validateNewsArticle(article);
      if (!validation.valid) {
        errors.push({
          index: i,
          error: validation.errors?.message || "Schema validation failed",
        });
        continue;
      }

      const validatedData = validation.data!;

      // Enforce word count safeguards
      const cleanText = validatedData.content.replace(/<[^>]*>?/gm, '');
      const wordCount = cleanText.split(/\s+/).length;

      if (wordCount < 300) {
        console.warn(`[Beacon-Hub Desk] Article ${i} rejected for thin content (${wordCount} words).`);
        continue;
      }

      const readingTime = calculateReadingTime(validatedData.content);

      validatedArticles.push({
        title: validatedData.title,
        slug: generateSlug(validatedData.title),
        category: validatedData.category,
        author: validatedData.authorPerspective, // Strictly uses Beacon-Hub Desk names
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        coverImage: validatedData.coverImage || null,
        publishedAt: new Date(),
        seoKeywords: validatedData.keywordTags,
        metaDescription: validatedData.metaDescription,
        authorPerspective: validatedData.authorPerspective,
        wordCount: wordCount,
        readingTimeMinutes: readingTime,
      });
    }

    if (validatedArticles.length === 0) {
      return NextResponse.json(
        {
          error: "No valid full-length articles generated",
          details: errors,
        },
        { status: 400 }
      );
    }

    // 6. PERSIST TO DATABASE
    const insertedArticles = await db.insert(articles).values(validatedArticles).returning();

    return NextResponse.json({
      success: true,
      message: `${insertedArticles.length} Premium Full-Length Articles deployed successfully.`,
      articlesCreated: insertedArticles.length,
      totalWordCount: validatedArticles.reduce((sum, a) => sum + a.wordCount, 0),
      averageReadTime: Math.round(
        validatedArticles.reduce((sum, a) => sum + a.readingTimeMinutes, 0) /
          validatedArticles.length
      ),
      validationErrors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("News Cron Error:", error);
    return NextResponse.json(
      {
        error: "Failed to deploy intelligence",
        message: error.message,
      },
      { status: 500 }
    );
  }
}