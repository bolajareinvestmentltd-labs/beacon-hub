import { db } from "../db";
import { articles, horoscopes, listings } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export async function getFeaturedArticle() {
  const data = await db.select().from(articles).where(eq(articles.slug, "araba-2027-vision")).limit(1);
  return data[0]; 
}

export async function getLatestBriefings() {
  return await db.select().from(articles).where(eq(articles.category, "Dev Log")).orderBy(desc(articles.createdAt)).limit(5); 
}

export async function getArticleBySlug(slug: string) {
  const data = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return data[0];
}

export async function getArticlesByCategory(categoryName: string) {
  return await db.select().from(articles).where(eq(articles.category, categoryName)).orderBy(desc(articles.createdAt));
}

export async function getActiveListings() {
  return await db.select().from(listings).where(eq(listings.isAvailable, true)).orderBy(desc(listings.createdAt));
}

// ⚡ NEW: Fetch Horoscopes
export async function getDailyHoroscopes() {
  return await db.select().from(horoscopes).orderBy(desc(horoscopes.date)).limit(12);
}
