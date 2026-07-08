import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc, ilike } from 'drizzle-orm';

export function sortLatestNews<T extends { publishedAt: string | Date }>(articles: T[]) {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function latestNews<T extends { publishedAt: string | Date }>(articles: T[], limit = 6) {
  return sortLatestNews(articles).slice(0, limit);
}

export async function getLiveNews(category?: string) {
  try {
    const normalizedCategory = category?.trim();
    const rows = normalizedCategory
      ? await db
          .select()
          .from(articles)
          .where(ilike(articles.category, `%${normalizedCategory}%`))
          .orderBy(desc(articles.publishedAt))
          .limit(12)
      : await db
          .select()
          .from(articles)
          .orderBy(desc(articles.publishedAt))
          .limit(12);

    return rows.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.excerpt,
      url: `/read/${article.slug}`,
      image: article.coverImage,
      source: { name: article.source || 'Beacon Hub' },
      publishedAt: article.publishedAt,
      category: article.category,
    }));
  } catch (error) {
    console.error('Unable to load live news:', error);
    return [];
  }
}

