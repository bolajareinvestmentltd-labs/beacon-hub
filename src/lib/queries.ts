import { db } from "@/db";
import { articles, horoscopes } from "@/db/schema";
import { desc, ilike, eq } from "drizzle-orm"; // Added 'eq' here

// 1. Fetch the absolute latest article to act as our Breaking Hero
export async function getHeroArticle() {
  const result = await db.select()
    .from(articles)
    .orderBy(desc(articles.publishedAt))
    .limit(1);
    
  return result[0] || null;
}

// 2. Fetch the next 10 articles for the Masonry Feed
export async function getLatestFeed(limit = 10) {
  const result = await db.select()
    .from(articles)
    .orderBy(desc(articles.publishedAt))
    .offset(1) 
    .limit(limit);
    
  return result;
}

// 3. Fetch articles for a specific category page
export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const searchPattern = `%${categorySlug.replace(/-/g, '%')}%`;
  const result = await db.select()
    .from(articles)
    .where(ilike(articles.category, searchPattern))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  return result;
}

// 4. NEW: Fetch a single article by its unique slug
export async function getArticleBySlug(slug: string) {
  const result = await db.select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
    
  return result[0] || null;
}

// 5. Placeholder for Horoscopes
// 4. Fetch today's celestial insights
export async function getDailyHoroscopes() {
  // In production, we'd filter by today's date, but let's grab the latest 12 for now
  const result = await db.select()
    .from(horoscopes)
    .orderBy(desc(horoscopes.publishDate))
    .limit(12);
    
  return result;
}
// 6. Fetch the latest reading for a specific sign (e.g., 'aries')
export async function getHoroscopeBySign(sign: string) {
  const result = await db.select()
    .from(horoscopes)
    .where(eq(horoscopes.sign, sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()))
    .orderBy(desc(horoscopes.publishDate))
    .limit(1);
    
  return result[0] || null;
}