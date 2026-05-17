import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return new NextResponse("Unauthorized Execution Protocol", { status: 401 });
  }

  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GNEWS_API_KEY) {
    return NextResponse.json({ error: "Critical GNews API Key Missing" }, { status: 500 });
  }

  try {
    console.log("⚡ Initiating Editorial Synthesis Engine...");

    const categoryTargets = [
      { name: "Top News", query: "general", country: "ng" },
      { name: "Global News", query: "world", country: "us" },
      { name: "Elections 2026", query: "nation", country: "ng" }
    ];
    
    const target = categoryTargets[Math.floor(Math.random() * categoryTargets.length)];
    console.log(`🎯 Targeting Sector: ${target.name}`);

    const gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${target.query}&lang=en&country=${target.country}&max=3&apikey=${GNEWS_API_KEY}`;
    const newsResponse = await fetch(gnewsUrl);
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      return NextResponse.json({ error: "No raw intelligence returned from upstream." }, { status: 500 });
    }

    const formattedArticles = [];

    for (const article of newsData.articles) {
      console.log(`📝 Processing Asset: ${article.title.substring(0, 30)}...`);
      
      let finalContent = article.content || article.description || "Content processing error.";
      
      // Attempt Gemini Expansion
      if (GEMINI_API_KEY) {
        const masterPrompt = `
          You are a senior investigative journalist. Expand this snippet into a professional, 4-paragraph editorial. 
          Return ONLY the raw article text.
          Headline: ${article.title}
          Snippet: ${article.description || article.content}
        `;

        try {
          const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: masterPrompt }] }],
              generationConfig: { temperature: 0.6 }
            })
          });

          if (aiResponse.ok) {
            const aiResult = await aiResponse.json();
            finalContent = aiResult.candidates[0].content.parts[0].text.trim();
            console.log("   [✓] AI Expansion Successful.");
          } else {
             throw new Error("AI Rate Limit");
          }
        } catch (aiError) {
          console.log("   [!] AI Locked. Applying safety fallback to short snippet.");
        }
      }

      // 🛡️ THE FIX: Always push the article, whether it's expanded or just the fallback snippet
      formattedArticles.push({
        title: article.title,
        slug: generateSlug(article.title),
        category: target.name,
        content: finalContent,
        excerpt: (article.description || "Tap to read full intelligence briefing...").substring(0, 150) + "...",
        imageUrl: article.image || null,
        isPublished: true,
        isBreaking: false,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    if (formattedArticles.length > 0) {
      await db.insert(articles).values(formattedArticles);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${formattedArticles.length} intelligence briefings deployed to ${target.name}.` 
    });

  } catch (error: any) {
    console.error("❌ Synthesis Engine Error:", error.message);
    return NextResponse.json({ error: "Failed to deploy intelligence" }, { status: 500 });
  }
}
