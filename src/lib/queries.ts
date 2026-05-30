import { db } from "@/db";
import { articles, horoscopes, deals } from "@/db/schema";
import { desc, ilike, eq, and, gte, lte } from "drizzle-orm";

// 1. Hero Article
export async function getHeroArticle() {
  try {
    const result = await db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.warn("Failed to fetch hero article:", error);
    return null;
  }
}

// 2. Main Feed
export async function getLatestFeed(limit = 10) {
  try {
    const result = await db.select().from(articles).orderBy(desc(articles.publishedAt)).offset(1).limit(limit);
    return result;
  } catch (error) {
    console.warn("Failed to fetch latest feed:", error);
    return [];
  }
}

// 3. Category Feed
export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const searchPattern = `%${categorySlug.replace(/-/g, '%')}%`;
  const result = await db.select().from(articles).where(ilike(articles.category, searchPattern)).orderBy(desc(articles.publishedAt)).limit(limit);
  return result;
}

// 4. Single Article Reading (THE MISSING FIX!)
export async function getArticleBySlug(slug: string) {
  const result = await db.select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return result[0] || null;
}

// 5. Single Horoscope (with optional date filter)
export async function getHoroscopeBySign(sign: string, date?: Date) {
  const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  
  if (date) {
    // Fetch reading for a specific date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const result = await db.select()
      .from(horoscopes)
      .where(
        and(
          eq(horoscopes.sign, normalizedSign),
          gte(horoscopes.publishDate, startOfDay),
          lte(horoscopes.publishDate, endOfDay)
        )
      )
      .limit(1);
    return result[0] || null;
  }
  
  // Default: get latest reading for this sign
  const result = await db.select()
    .from(horoscopes)
    .where(eq(horoscopes.sign, normalizedSign))
    .orderBy(desc(horoscopes.publishDate))
    .limit(1);
  return result[0] || null;
}

// 6. Daily Horoscopes Grid
export async function getDailyHoroscopes() {
  try {
    const result = await db.select({
      id: horoscopes.id,
      sign: horoscopes.sign,
    }).from(horoscopes).orderBy(desc(horoscopes.publishDate)).limit(12);
    return result;
  } catch (error) {
    console.warn("Failed to fetch horoscopes, returning empty array:", error);
    return [];
  }
}

// 7. Marketplace Deals
export async function getActiveListings() {
  const result = await db.select().from(deals).where(eq(deals.isActive, true)).orderBy(desc(deals.createdAt));
  return result;
}
