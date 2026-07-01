import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Allow the Vercel function more time to execute since longer articles take longer to write
export const maxDuration = 60;

export async function GET(req: Request) {
  // Security lock: Only allow authorized cron requests
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL || "");

  // Call the Gemini model
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
                text: "You are the Senior Editor for a premium news portal named Beacon-Hub. Generate 3 breaking news articles focusing on Global News, Tech & Startups, and Elections 2026. Return strictly in JSON format as an array of objects with the following keys: 'title', 'category', 'slug' (a URL-friendly string), 'image_url' (leave empty if no verified image is available, our system has a fallback), and 'content'. CRITICAL INSTRUCTION: The 'content' key MUST contain a comprehensive, deep-dive editorial consisting of at least 4 to 5 detailed paragraphs. Do not write short summaries. Ensure the tone is objective, analytical, and highly professional.",
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

  const data = await response.json();
  if (data?.error) {
    throw new Error(data.error.message || "Gemini API error");
  }

  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    return NextResponse.json(
      { success: false, error: "Empty response from Gemini engine" },
      { status: 500 }
    );
  }

  const articles = JSON.parse(textResponse);

  // Inject the new, long-form articles into the Neon database
  for (const article of articles) {
    await sql`
      INSERT INTO articles (title, slug, category, content, image_url, created_at)
      VALUES (
        ${article.title},
        ${article.slug},
        ${article.category},
        ${article.content},
        ${article.image_url},
        NOW()
      )
      ON CONFLICT (slug) DO NOTHING;
    `;
  }

  return NextResponse.json({
    success: true,
    message: "Deep-dive intelligence deployed successfully.",
  });
}

