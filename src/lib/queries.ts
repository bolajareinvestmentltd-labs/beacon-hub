'use server';

import { db } from '@/db';
import {
  articles,
  horoscopes,
  deals,
  contentMetrics,
  editorialSections,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const articleOrder = (column: typeof articles.publishedAt) => desc(column);

export async function getHeroArticle() {
  try {
    const hero = await db
      .select()
      .from(articles)
      .orderBy(articleOrder(articles.publishedAt))
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
      .orderBy(articleOrder(articles.publishedAt))
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
      .orderBy(articleOrder(articles.publishedAt))
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
      .orderBy(articleOrder(articles.publishedAt))
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
      .where(eq(contentMetrics.articleId, Number(articleId)))
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
    const articleIdNumber = Number(articleId);

    if (existing) {
      await db
        .update(contentMetrics)
        .set({ views: (existing.views || 0) + 1 })
        .where(eq(contentMetrics.articleId, articleIdNumber));
    } else {
      await db.insert(contentMetrics).values({
        articleId: articleIdNumber,
        views: 1,
        uniqueVisitors: 0,
        engagementScore: 0,
        avgReadDuration: 0,
        bounceRate: 0,
        createdAt: new Date(),
        lastUpdated: new Date(),
      });
    }
  } catch (error) {
    console.error('Error incrementing article views:', error);
  }
}

export async function getRelatedArticles(articleId: number, limit = 4) {
  try {
    const related = await db
      .select()
      .from(articles)
      .orderBy(articleOrder(articles.publishedAt))
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
  try {
    const normalized =
      sign.trim().charAt(0).toUpperCase() + sign.trim().slice(1).toLowerCase();

    const reading = await db
      .select()
      .from(horoscopes)
      .where(eq(horoscopes.sign, normalized))
      .orderBy(desc(horoscopes.publishDate))
      .limit(1);

    return reading[0] || null;
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    return null;
  }
}

export async function getAllHoroscopes() {
  try {
    return await db
      .select()
      .from(horoscopes)
      .orderBy(desc(horoscopes.publishDate));
  } catch (error) {
    console.error('Error fetching all horoscopes:', error);
    return [];
  }
}

export async function getDailyHoroscopes() {
  try {
    return await db
      .select()
      .from(horoscopes)
      .orderBy(desc(horoscopes.publishDate))
      .limit(12);
  } catch (error) {
    console.error('Error fetching daily horoscopes:', error);
    return [];
  }
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

// Compatibility export (older pages reference this name)
export async function getHoroscopes() {
  return getAllHoroscopes();
}

export async function searchArticles(_query: string, limit = 10) {
  try {
    // NOTE: kept intentionally simple; full search can be added later.
    const results = await db
      .select()
      .from(articles)
      .orderBy(articleOrder(articles.publishedAt))
      .limit(limit);
    return results;
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

