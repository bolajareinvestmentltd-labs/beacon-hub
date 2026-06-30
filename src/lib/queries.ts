'use server';

import { db } from '@/db';
import { articles, horoscopes, deals, contentMetrics, editorialSections } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getHeroArticle() {
  try {
    const hero = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(1);
    return hero[0] || null;
  } catch (error) {
    console.error('Error fetching hero article:', error);
    return null;
  }
}

export async function getFeaturedArticles(limit = 4) {
  try {
    const featured = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
    return featured;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

export async function getBreakingNews(limit = 5) {
  try {
    const breaking = await db
      .select()
      .from(articles)
      .where(eq(articles.isBreaking, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
    return breaking;
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return [];
  }
}

export async function getArticles(limit = 12) {
  try {
    const allArticles = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
    return allArticles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    return article[0] || null;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

export async function getArticleMetrics(articleId: string) {
  try {
    const metrics = await db
      .select()
      .from(contentMetrics)
      .where(eq(contentMetrics.articleId, articleId))
      .limit(1);
    return metrics[0] || null;
  } catch (error) {
    console.error('Error fetching article metrics:', error);
    return null;
  }
}

export async function incrementArticleViews(articleId: string) {
  try {
    const existing = await getArticleMetrics(articleId);
    if (existing) {
      await db
        .update(contentMetrics)
        .set({ views: (existing.views || 0) + 1 })
        .where(eq(contentMetrics.articleId, articleId));
    } else {
      await db.insert(contentMetrics).values({
        articleId,
        views: 1,
        likes: 0,
        shares: 0,
        comments: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error incrementing article views:', error);
  }
}

export async function getRelatedArticles(articleId: string, limit = 4) {
  try {
    const related = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(limit + 1);
    return related.filter((a) => a.id !== articleId).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function getEditorialSections() {
  try {
    const sections = await db
      .select()
      .from(editorialSections)
      .orderBy(editorialSections.name);
    return sections;
  } catch (error) {
    console.error('Error fetching editorial sections:', error);
    return [];
  }
}

export async function getHoroscopeBySign(sign: string) {
<<<<<<< HEAD
  try {
    const reading = await db
      .select()
      .from(horoscopes)
      .where(eq(horoscopes.sign, sign))
      .limit(1);
    return reading[0] || null;
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    return null;
  }
}

export async function getAllHoroscopes() {
  try {
    const allReadings = await db
      .select()
      .from(horoscopes)
      .orderBy(horoscopes.sign);
    return allReadings;
  } catch (error) {
    console.error('Error fetching all horoscopes:', error);
    return [];
  }
=======
  const result = await db.select().from(horoscopes).where(eq(horoscopes.sign, sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase())).orderBy(desc(horoscopes.createdAt)).limit(1);
  return result[0] || null;
}

// 6. Daily Horoscopes Grid
export async function getDailyHoroscopes() {
  const result = await db.select().from(horoscopes).orderBy(desc(horoscopes.createdAt)).limit(12);
  return result;
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
}

export async function getDeals(limit = 8) {
  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt))
      .limit(limit);
    return allDeals;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

export async function searchArticles(query: string, limit = 10) {
  try {
    const results = await db
      .select()
      .from(articles)
      .limit(limit);
    return results;
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}