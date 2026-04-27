import { db } from "../db";
import { articles, horoscopes, listings } from "../db/schema";
import { desc, eq } from "drizzle-orm";

// 1. Fetch the absolute newest article (For your Hero Section / ARABA Ads)
export async function getFeaturedArticle() {
  const data = await db.select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(1);
  return data[0]; // Returns the single newest post
}

// 2. Fetch the latest general briefings (For the Main Column)
export async function getLatestBriefings() {
  return await db.select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(5); // Grabs the last 5 articles
}

// 3. Fetch articles by specific category (e.g., "Politics" or "Tech")
export async function getArticlesByCategory(categoryName: string) {
  return await db.select()
    .from(articles)
    .where(eq(articles.category, categoryName))
    .orderBy(desc(articles.createdAt));
}

// 4. Fetch the latest active Deals (Cars/Houses)
export async function getActiveListings() {
  return await db.select()
    .from(listings)
    .where(eq(listings.isAvailable, true))
    .orderBy(desc(listings.createdAt))
    .limit(3);
}
