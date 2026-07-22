import { NextResponse } from "next/server";
import { persistIncomingArticles } from '@/lib/news-sync';

export const maxDuration = 60;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds

// Exponential backoff retry helper
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${label}] Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[${label}] Attempt ${attempt} failed: ${lastError.message}`);
      
      if (attempt < maxRetries) {
        const delay = BASE_DELAY * Math.pow(2, attempt - 1);
        console.log(`[${label}] Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`${label} failed after ${maxRetries} retries`);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 240);
}

async function fetchNewsFromGNews() {
  if (!GNEWS_API_KEY) {
    return [];
  }

  const query = encodeURIComponent('Elections 2027 OR Global News OR Tech & Startups');
  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&sortby=publishedAt&token=${GNEWS_API_KEY}`;

  const response = await fetch(url, { method: 'GET' });
  const text = await response.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (parseError) {
    throw new Error(`GNews returned invalid JSON: ${(parseError as Error).message}`);
  }

  if (!response.ok) {
    const message = data?.message || `GNews request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!Array.isArray(data.articles)) {
    throw new Error('GNews returned an unexpected response shape.');
  }

  return data.articles.map((article: any, index: number) => {
    const title = String(article.title || `News item ${index + 1}`).trim();
    const category = String(article.source?.name || 'Global News').trim();
    const description = String(article.description || '').trim();
    const content = String(article.content || description || title).trim();
    const slugCandidate = article.url ? slugify(`${article.url}-${title}`) : slugify(title);

    return {
      title,
      category,
      slug: slugCandidate,
      image_url: article.image || null,
      excerpt: description || content.slice(0, 220),
      content: `${content}

Source: ${category}${article.url ? `\nRead more: ${article.url}` : ''}`,
      author: String(article.author || category || 'GNews').trim(),
      source: String(article.source?.name || 'GNews').trim(),
      published_at: article.publishedAt || new Date().toISOString(),
    };
  });
}

async function fetchNewsFromGemini() {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const prompt = `You are the Senior Editor for a premium news portal named Beacon-Hub. Generate 2 breaking news articles focusing on Global News, Tech & Startups, and Elections 2027. Return strictly in JSON format as an array of objects with the following keys: 'title', 'category', 'slug', 'image_url', 'content', and 'excerpt'. CRITICAL INSTRUCTION: The 'content' key MUST contain a comprehensive, deep-dive editorial consisting of at least 4 to 5 detailed paragraphs. Do not write short summaries. Ensure the tone is objective, analytical, and highly professional.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 1024,
          temperature: 0.4,
          topP: 0.95,
        },
      }),
    }
  );

  const rawResult = await response.text();
  let data: any = null;

  try {
    data = JSON.parse(rawResult);
  } catch {
    // Fall back to raw text when Gemini returns non-JSON error details.
  }

  if (!response.ok) {
    const retryAfter = response.headers.get('retry-after');
    const message =
      data?.error?.message || data?.error?.status || `Gemini request failed with status ${response.status}`;
    const details = retryAfter ? `${message}; retry-after=${retryAfter}` : message;

    if (response.status === 429) {
      throw new Error(`Gemini rate limit reached: ${details}`);
    }

    throw new Error(details);
  }

  if (data?.error) {
    const errorMessage = data.error.message || data.error.status || "Gemini API error";
    throw new Error(errorMessage);
  }

  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse || typeof textResponse !== 'string') {
    throw new Error("Empty or invalid response from Gemini engine");
  }

  const cleaned = textResponse.trim();
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    throw new Error(`Gemini returned invalid JSON payload; parse error: ${(parseError as Error).message}; body=${cleaned.slice(0, 500)}`);
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const isAuthorized = isVercelCron || authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let articles = await retryWithBackoff(
      () => fetchNewsFromGNews(),
      "GNews fetch",
      MAX_RETRIES
    );
    let source = 'GNews';

    if (!articles.length) {
      console.log('GNews returned no articles, trying Gemini...');
      articles = await retryWithBackoff(
        () => fetchNewsFromGemini(),
        "Gemini fetch",
        MAX_RETRIES
      );
      source = 'Gemini';
    }

    const result = await persistIncomingArticles(articles);

    return NextResponse.json({
      success: true,
      source,
      inserted: result.inserted.length,
      skipped: result.skipped.length,
      message: `${source} intelligence deployed successfully.`,
    });
  } catch (error) {
    console.error("News sync failed:", error);
    const message = error instanceof Error ? error.message : "News sync failed";
    const status = message.includes('rate limit') ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
        retryable: status === 429,
        message: "Both APIs temporarily unavailable. Retry scheduled for next cron window.",
      },
      { status }
    );
  }
}


