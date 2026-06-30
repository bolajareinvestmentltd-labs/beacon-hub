import { db } from '@/db';
import { articles, contentRelationships } from '@/db/schema';
import { desc, and, ne, eq } from 'drizzle-orm';

export async function getRelatedContentByKeywords(
  articleId: string,
  keywords: string[],
  limit: number = 5
): Promise<any[]> {
  if (keywords.length === 0) return [];

  try {
    const relatedArticles = await db
      .select()
      .from(articles)
      .where(ne(articles.id, articleId))
      .orderBy(desc(articles.views))
      .limit(limit);

    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related content:', error);
    return [];
  }
}

export async function getRelatedContentByCategory(
  articleId: string,
  category: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const relatedArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          ne(articles.id, articleId),
          eq(articles.category, category)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related content by category:', error);
    return [];
  }
}

export async function createContentRelationship(
  sourceArticleId: string,
  relatedArticleId: string,
  matchType: 'keyword' | 'category' | 'author'
): Promise<void> {
  try {
    await db.insert(contentRelationships).values({
      sourceArticleId,
      relatedArticleId,
      matchType,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating content relationship:', error);
  }
}