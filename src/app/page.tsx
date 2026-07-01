import Link from 'next/link';
import { getArticles, getFeaturedArticles, getBreakingNews } from '@/lib/queries';
import AsymmetricalHeroLayout from '@/components/AsymmetricalHeroLayout';
import SectionHeaderComponent from '@/components/SectionHeaderComponent';
import AdPlacementManager from '@/components/AdPlacementManager';
import { premiumClasses } from '@/lib/premiumStyles';
import { latestNews } from '@/lib/news';
import * as queries from '@/lib/queries';

type ArticleLike = {
  id?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  publishedAt?: string | Date | null;
};

const normalizeArticles = (payload: unknown): ArticleLike[] => {
  if (Array.isArray(payload)) return payload as ArticleLike[];
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { articles?: unknown }).articles)
  ) {
    return (payload as { articles: ArticleLike[] }).articles;
  }
  return [];
};

const sortByNewest = (articles: ArticleLike[]) =>
  [...articles].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const queryFns = queries as Record<string, unknown>;
  const getter =
    (queryFns.getArticles as (() => Promise<unknown>) | undefined) ??
    (queryFns.getFeaturedArticles as (() => Promise<unknown>) | undefined) ??
    (queryFns.getBreakingNews as (() => Promise<unknown>) | undefined) ??
    (queryFns.getLiveNews as (() => Promise<unknown>) | undefined);

  let articles: ArticleLike[] = [];

  if (typeof getter === 'function') {
    try {
      const payload = await getter();
      articles = normalizeArticles(payload);
    } catch (error) {
      console.warn('Unable to load homepage articles:', error);
    }
  }

  const latest = sortByNewest(articles).slice(0, 6);

  const heroArticle = latest[0]
    ? {
        id: latest[0].id ?? 1,
        slug: latest[0].slug ?? 'latest-news',
        title: latest[0].title ?? 'Latest news',
        excerpt: latest[0].excerpt ?? latest[0].description ?? '',
        category: latest[0].category ?? 'Top News',
        coverImage: latest[0].coverImage ?? '',
        publishedAt: latest[0].publishedAt ? new Date(latest[0].publishedAt) : new Date(),
      }
    : undefined;

  const feedArticles = latest.slice(1).map((article, index) => ({
    id: article.id ?? index + 2,
    slug: article.slug ?? `article-${index + 2}`,
    title: article.title ?? 'Latest news',
    category: article.category ?? 'Top News',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
  }));

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AsymmetricalHeroLayout
          article={heroArticle}
          feedArticles={feedArticles}
          logoUrl="/beacon-logo.svg"
          headerAdLabel="New & Latest News"
        />
      </div>
    </main>
  );
}
