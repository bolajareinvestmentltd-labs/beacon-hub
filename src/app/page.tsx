import Link from 'next/link';
import { getArticles, getFeaturedArticles, getBreakingNews } from '@/lib/queries';
import AsymmetricalHeroLayout from '@/components/AsymmetricalHeroLayout';
import SectionHeaderComponent from '@/components/SectionHeaderComponent';
import AdPlacementManager from '@/components/AdPlacementManager';
import { premiumClasses } from '@/lib/premiumStyles';
import { latestNews } from '@/lib/news';
import * as queries from '@/lib/queries';
import QuoteCard from '@/components/QuoteCard';
import RelatedContentGrid from '@/components/RelatedContentGrid';

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

  const latest = sortByNewest(articles).slice(0, 18);

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

  const feedArticles = latest.slice(1, 6).map((article, index) => ({
    id: article.id ?? index + 2,
    slug: article.slug ?? `article-${index + 2}`,
    title: article.title ?? 'Latest news',
    category: article.category ?? 'Top News',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
  }));

  const moreStories = latest.slice(6, 12).map((article, index) => ({
    id: article.id ?? index + 7,
    slug: article.slug ?? `story-${index + 7}`,
    title: article.title ?? 'More stories',
    excerpt: article.excerpt ?? article.description ?? 'Fresh reporting and sharp analysis from Beacon-Hub.',
    category: article.category ?? 'Top News',
    coverImage: article.coverImage ?? '',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    authorPerspective: 'Editorial Board',
  }));

  const trendingNow = latest.slice(12, 18).map((article, index) => ({
    id: article.id ?? index + 13,
    slug: article.slug ?? `trending-${index + 13}`,
    title: article.title ?? 'Trending now',
    excerpt: article.excerpt ?? article.description ?? 'A quick read on what is moving across the newsroom.',
    category: article.category ?? 'Top News',
    coverImage: article.coverImage ?? '',
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    authorPerspective: 'Beacon-Hub Desk',
  }));

  const quoteText =
    latest[0]?.excerpt ?? latest[0]?.description ?? 'Editorial clarity cuts through the noise and keeps the signal sharp.';
  const quoteAuthor = latest[0]?.category ? `${latest[0].category} Desk` : 'Beacon-Hub Editorial';

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="mt-8 md:mt-10">
          <AsymmetricalHeroLayout
            article={heroArticle}
            feedArticles={feedArticles}
            logoUrl="/logo.png"
            headerAdLabel="New & Latest News"
          />
        </div>

        <div className="mt-16 md:mt-24">
          <RelatedContentGrid articles={moreStories} title="More Stories" limit={6} />
        </div>

        <div className="mt-16 md:mt-24">
          <QuoteCard quote={quoteText} author={quoteAuthor} role="Editorial Briefing" />
        </div>

        <div className="mt-16 md:mt-24">
          <RelatedContentGrid articles={trendingNow} title="Trending Now" limit={6} />
        </div>
      </div>
    </main>
  );
}