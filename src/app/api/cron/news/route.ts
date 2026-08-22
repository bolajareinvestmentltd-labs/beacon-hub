import { NextResponse } from "next/server";
import { persistIncomingArticles } from '@/lib/news-sync';
import { isAuthorizedCronRequest } from '@/lib/cron';

export const maxDuration = 60;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const NEWS_CATEGORIES = ['Global News', 'Tech & Startups', 'Elections 2027'] as const;

type GNewsArticle = {
  title?: unknown;
  description?: unknown;
  content?: unknown;
  image?: unknown;
  url?: unknown;
  author?: unknown;
  source?: { name?: unknown };
  publishedAt?: unknown;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 240);
}

function classifyNews(title: string, description: string) {
  const searchableText = `${title} ${description}`.toLowerCase();

  if (/election|politic|government|senate|president|governor|party/.test(searchableText)) {
    return 'Elections 2027';
  }

  if (/tech|startup|software|artificial intelligence|digital|cyber|innovation/.test(searchableText)) {
    return 'Tech & Startups';
  }

  return 'Global News';
}

async function fetchNewsFromGNews() {
  if (!GNEWS_API_KEY) {
    return [];
  }

  const query = encodeURIComponent('Elections 2027 OR Global News OR Tech & Startups');
  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&sortby=publishedAt&token=${GNEWS_API_KEY}`;

  const response = await fetch(url, { method: 'GET' });
  const text = await response.text();

  let data: { articles?: GNewsArticle[]; message?: string };
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

  return data.articles.map((article, index: number) => {
    const title = String(article.title || `News item ${index + 1}`).trim();
    const description = String(article.description || '').trim();
    const content = String(article.content || description || title).trim();
    const category = classifyNews(title, description);
    const articleUrl = typeof article.url === 'string' ? article.url : '';
    const slugCandidate = articleUrl ? slugify(`${articleUrl}-${title}`) : slugify(title);

    return {
      title,
      category,
      slug: slugCandidate,
      image_url: typeof article.image === 'string' ? article.image : null,
      excerpt: description || content.slice(0, 220),
      content: `${content}

    Source: ${category}${articleUrl ? `\nRead more: ${articleUrl}` : ''}`,
      author: typeof article.author === 'string' ? article.author.trim() : category,
      source: typeof article.source?.name === 'string' ? article.source.name.trim() : 'GNews',
      published_at: typeof article.publishedAt === 'string' ? article.publishedAt : new Date().toISOString(),
    };
  });
}

async function fetchNewsFromGemini() {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const prompt = `You are the Senior Editor for Beacon Hub. Generate 2 original editorial news articles across these categories only: ${NEWS_CATEGORIES.join(', ')}. Return strictly as a JSON array with the keys title, category, slug, image_url, content, excerpt, metaDescription, author, and source. Use null for image_url unless you can provide a real, publicly accessible HTTPS JPEG or PNG URL. The content must contain at least 4 detailed paragraphs, and metaDescription must be 50-160 characters. Keep the tone objective and analytical.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 4096,
          temperature: 0.4,
          topP: 0.95,
        },
      }),
    }
  );

  const rawResult = await response.text();
  let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>; error?: { message?: string; status?: string } } | null = null;

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
    const parsed: unknown = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) {
      throw new Error('Gemini response must be an array of articles');
    }
    return parsed;
  } catch (parseError) {
    throw new Error(`Gemini returned invalid JSON payload; parse error: ${(parseError as Error).message}; body=${cleaned.slice(0, 500)}`);
  }
}

export async function GET(req: Request) {
  const isAuthorized = isAuthorizedCronRequest(req, { allowVercelCron: true });

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let articles = await fetchNewsFromGNews();
    let source = 'GNews';

    if (!articles.length) {
      articles = await fetchNewsFromGemini();
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
      },
      { status }
    );
  }
}


