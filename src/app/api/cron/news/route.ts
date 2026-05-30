import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";

// This tells Next.js to allow this function to run for up to 60 seconds (since full stories take longer to write)
export const maxDuration = 60; 

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized: Invalid Cron Secret', { status: 401 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
  }

  const prompt = `You are the lead editor for Beacon-Hub. Generate 5 massive breaking news features.
  Categories required (one of each): "sport", "entertainment", "tech", "real-estate", "elections".
  
  Return a JSON array where each object has these keys exactly:
  "title": Catchy premium headline.
  "content": Full-length article formatted in rich HTML. Include <h2> tags, multiple <p> tags, and embed an Unsplash image using <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" class="w-full h-auto rounded-2xl my-8 object-cover shadow-lg" alt="Editorial Image">.
  "excerpt": 2-sentence summary.
  "category": The exact category name.
  "cover_image": High quality Unsplash image URL.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // THIS IS THE MAGIC BULLET: Forces 100% valid JSON from Gemini
        generationConfig: { responseMimeType: "application/json" },
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await res.json();
    
    // With JSON mode, we don't need to manually strip markdown backticks anymore
    const textResponse = data.candidates[0].content.parts[0].text;
    const aiArticles = JSON.parse(textResponse);

    const formattedArticles = aiArticles.map((article: any) => ({
      title: article.title,
      slug: generateSlug(article.title),
      category: article.category,
      author: "Beacon-Hub Editorial Board",
      content: article.content,
      excerpt: article.excerpt,
      coverImage: article.cover_image, 
      publishedAt: new Date(),
    }));

    await db.insert(articles).values(formattedArticles);

    return NextResponse.json({ 
      success: true, 
      message: "5 Full-Length Multimedia Features deployed successfully." 
    });
  } catch (error) {
    // If it fails again, it will log the exact reason in your Next.js terminal!
    console.error("AI News Cron Error:", error);
    return NextResponse.json({ error: "Failed to deploy intelligence" }, { status: 500 });
  }
}