import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc } from 'drizzle-orm';

export function sortLatestNews<T extends { publishedAt: string | Date }>(articles: T[]) {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function latestNews<T extends { publishedAt: string | Date }>(articles: T[], limit = 6) {
  return sortLatestNews(articles).slice(0, limit);
}

function normalizeCategoryKey(value?: string | null) {
  return (value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function matchesCategory(articleCategory: string | null | undefined, requestedCategory?: string) {
  if (!requestedCategory?.trim()) {
    return true;
  }

  const requestedKey = normalizeCategoryKey(requestedCategory);
  const articleKey = normalizeCategoryKey(articleCategory);

  if (!requestedKey || !articleKey) {
    return false;
  }

  return articleKey === requestedKey || articleKey.includes(requestedKey) || requestedKey.includes(articleKey);
}

export async function getLiveNews(category?: string, limit = 12) {
  try {
    const normalizedCategory = category?.trim();
    const baseRows = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(Math.max(limit * 2, 24));

    const filteredRows = normalizedCategory
      ? baseRows.filter((article) => matchesCategory(article.category, normalizedCategory))
      : baseRows;

    const rows = filteredRows.length > 0 ? filteredRows : baseRows;

    return rows.slice(0, limit).map((article) => ({
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

