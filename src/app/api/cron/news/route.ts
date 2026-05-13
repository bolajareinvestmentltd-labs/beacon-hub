import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
};

export async function GET() {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

  if (!GNEWS_API_KEY) {
    return NextResponse.json({ error: "Missing GNEWS API Key" }, { status: 500 });
  }

  try {
    // Fetching Top News with a focus on Nigeria (country=ng) and English language
    const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=ng&max=10&apikey=${GNEWS_API_KEY}`);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return NextResponse.json({ error: "No articles returned from upstream" }, { status: 500 });
    }

    const formattedArticles = data.articles.map((article: any) => ({
      title: article.title,
      slug: generateSlug(article.title),
      category: "Global News", 
      // THE INSTITUTIONAL SIGNATURE:
      author: "Beacon-Hub", 
      content: article.content || article.description,
      excerpt: article.description?.substring(0, 150) + "...",
      coverImage: article.image || null,
      publishedAt: new Date(article.publishedAt),
    }));

    await db.insert(articles).values(formattedArticles);

    return NextResponse.json({ success: true, message: "10 Intelligence briefings deployed successfully." });
  } catch (error) {
    console.error("News Cron Error:", error);
    return NextResponse.json({ error: "Failed to deploy intelligence" }, { status: 500 });
  }
}
