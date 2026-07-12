import { NextResponse } from "next/server";
import { persistIncomingArticles } from '@/lib/news-sync';

// Allow the Vercel function more time to execute since longer articles take longer to write
export const maxDuration = 60;

async function fetchNewsFromGemini() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are the Senior Editor for a premium news portal named Beacon-Hub. Generate 3 breaking news articles focusing on Global News, Tech & Startups, and Elections 2026. Return strictly in JSON format as an array of objects with the following keys: 'title', 'category', 'slug' (a URL-friendly string), 'image_url' (leave empty if no verified image is available, our system has a fallback), 'content', and 'excerpt'. CRITICAL INSTRUCTION: The 'content' key MUST contain a comprehensive, deep-dive editorial consisting of at least 4 to 5 detailed paragraphs. Do not write short summaries. Ensure the tone is objective, analytical, and highly professional.",
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
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
    const payload = await fetchNewsFromGemini();
    const result = await persistIncomingArticles(payload);

    return NextResponse.json({
      success: true,
      inserted: result.inserted.length,
      skipped: result.skipped.length,
      message: "Deep-dive intelligence deployed successfully.",
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


