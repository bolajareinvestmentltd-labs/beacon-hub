import { NextResponse } from "next/server";
import { db } from "@/db"; // Ensure this points to your Neon connection file
import { articles } from "@/db/schema";

// Helper function to create clean URLs from headlines (e.g., "New Tech Event" -> "new-tech-event")
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export async function GET(request: Request) {
  // Security check: You can add a secret token here later so only Vercel can trigger this
  
  // We will fetch "Top News" (general) and "Tech & Startups" (technology) for this run
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY; 
  
  if (!GNEWS_API_KEY) {
    return NextResponse.json({ error: "Missing GNEWS_API_KEY" }, { status: 500 });
  }

  try {
    // 1. Fetch live global headlines
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${GNEWS_API_KEY}`);
    const data = await res.json();

    if (!data.articles) {
      return NextResponse.json({ error: "Failed to fetch news", details: data }, { status: 400 });
    }

    // 2. Format the live data to match our exact Drizzle schema
    const formattedArticles = data.articles.map((article: any, index: number) => ({
      title: article.title,
      slug: generateSlug(article.title) + `-${Date.now().toString().slice(-4)}`, // Ensure uniqueness
      excerpt: article.description || "Click to read the full briefing.",
      content: article.content || article.description,
      category: "Global News", // We map this to our TAXONOMY
      author: article.source.name || "Beacon-Hub Intelligence",
      source: article.source.name,
      coverImage: article.image,
      isBreaking: index === 0, // Make the absolute newest article the "Breaking" hero!
      publishedAt: new Date(article.publishedAt),
    }));

    // 3. Insert into Neon Database (Silently ignore duplicates if we already fetched them)
    // Drizzle's 'onConflictDoNothing' prevents the database from crashing if it sees the same slug twice
    await db.insert(articles)
      .values(formattedArticles)
      .onConflictDoNothing({ target: articles.slug });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ingested ${formattedArticles.length} live articles into Neon.` 
    });

  } catch (error) {
    console.error("News Ingestion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}