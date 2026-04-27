import { db } from "../db";
import { articles, horoscopes, listings } from "../db/schema";
import { desc, eq } from "drizzle-orm";

// 1. PINNED HERO: Fetch the ARABA Campaign explicitly
export async function getFeaturedArticle() {
  const data = await db.select()
    .from(articles)
    .where(eq(articles.slug, "araba-2027-vision"))
    .limit(1);
  return data[0]; 
}

// 2. Fetch the latest general briefings (For the Main Column)
export async function getLatestBriefings() {
  return await db.select()
    .from(articles)
    .where(eq(articles.category, "Dev Log")) // Just an example to separate them
    .orderBy(desc(articles.createdAt))
    .limit(5); 
}

// 3. Fetch articles by specific category
export async function getArticlesByCategory(categoryName: string) {
  return await db.select()
    .from(articles)
    .where(eq(articles.category, categoryName))
    .orderBy(desc(articles.createdAt));
}

// 4. Fetch the latest active Deals
export async function getActiveListings() {
  return await db.select()
    .from(listings)
    .where(eq(listings.isAvailable, true))
    .orderBy(desc(listings.createdAt))
    .limit(3);
}
