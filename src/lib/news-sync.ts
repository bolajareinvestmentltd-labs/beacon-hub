import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type NewsArticleInput = {
  title?: string;
  slug?: string;
  category?: string;
  content?: string;
  excerpt?: string;
  image_url?: string | null;
  imageUrl?: string | null;
  is_breaking?: boolean | null;
  isBreaking?: boolean | null;
  is_sponsored?: boolean | null;
  isSponsored?: boolean | null;
  published_at?: string | Date | null;
  publishedAt?: string | Date | null;
  author?: string | null;
  source?: string | null;
  metaDescription?: string | null;
  seoKeywords?: string[] | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toExcerpt(value?: string | null, fallback = 'No summary available.') {
  const cleaned = value?.replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

export function normalizeIncomingArticle(article: NewsArticleInput) {
  const title = article.title?.trim() || 'Untitled article';
  const category = article.category?.trim() || 'World';
  const content = article.content?.trim() || article.excerpt?.trim() || 'No content available.';
  const excerpt = toExcerpt(article.excerpt || content, content);
  const slug = (article.slug || slugify(title) || `article-${Date.now()}`).trim().toLowerCase();
  const isBreaking = Boolean(
    article.is_breaking ?? article.isBreaking ?? /breaking/i.test(category)
  );
  const isSponsored = Boolean(
    article.is_sponsored ?? article.isSponsored ?? /sponsor/i.test(category)
  );

  return {
    title,
    slug,
    category,
    content,
    excerpt,
    coverImage: article.image_url || article.imageUrl || null,
    isBreaking,
    isSponsored,
    publishedAt: article.published_at || article.publishedAt || new Date(),
    author: article.author?.trim() || 'Beacon-Hub Intelligence',
    source: article.source?.trim() || 'Beacon Hub',
    metaDescription: toExcerpt(article.metaDescription, excerpt),
    seoKeywords: Array.isArray(article.seoKeywords) ? article.seoKeywords.slice(0, 8) : [],
  };
}

export async function persistIncomingArticles(inputArticles: NewsArticleInput[]) {
  const inserted: string[] = [];
  const skipped: string[] = [];

  for (const article of inputArticles) {
    try {
      const normalized = normalizeIncomingArticle(article);
      const existing = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, normalized.slug))
        .limit(1);

      if (existing.length > 0) {
        skipped.push(normalized.slug);
        continue;
      }

      await db.insert(articles).values({
        title: normalized.title,
        slug: normalized.slug,
        excerpt: normalized.excerpt,
        content: normalized.content,
        category: normalized.category,
        author: normalized.author,
        source: normalized.source,
        coverImage: normalized.coverImage,
        isBreaking: normalized.isBreaking,
        isSponsored: normalized.isSponsored,
        metaDescription: normalized.metaDescription,
        seoKeywords: normalized.seoKeywords,
        publishedAt: normalized.publishedAt as Date,
        createdAt: new Date(),
      });

      inserted.push(normalized.slug);
    } catch (error) {
      console.error('Unable to persist news article:', error);
    }
  }

  return { inserted, skipped };
}
