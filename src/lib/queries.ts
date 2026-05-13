import { db } from "@/db";
import { articles, horoscopes, deals } from "@/db/schema";
import { desc, ilike, eq } from "drizzle-orm";

export async function getHeroArticle() {
  const result = await db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(1);
  return result[0] || null;
}

export async function getLatestFeed(limit = 10) {
  const result = await db.select().from(articles).orderBy(desc(articles.publishedAt)).offset(1).limit(limit);
  return result;
}

export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const searchPattern = `%${categorySlug.replace(/-/g, '%')}%`;
  const result = await db.select().from(articles).where(ilike(articles.category, searchPattern)).orderBy(desc(articles.publishedAt)).limit(limit);
  return result;
}

export async function getHoroscopeBySign(sign: string) {
  const result = await db.select().from(horoscopes).where(eq(horoscopes.sign, sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase())).orderBy(desc(horoscopes.publishDate)).limit(1);
  return result[0] || null;
}

export async function getDailyHoroscopes() {
  const result = await db.select().from(horoscopes).orderBy(desc(horoscopes.publishDate)).limit(12);
  return result;
}

export async function getActiveListings() {
  const result = await db.select().from(deals).where(eq(deals.isActive, true)).orderBy(desc(deals.createdAt));
  return result;
}
