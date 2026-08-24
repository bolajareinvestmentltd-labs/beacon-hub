import Link from 'next/link';
import AsymmetricalHeroLayout from '@/components/AsymmetricalHeroLayout';
import SectionHeaderComponent from '@/components/SectionHeaderComponent';
import * as queries from '@/lib/queries';
import QuoteCard from '@/components/QuoteCard';
import RelatedContentGrid from '@/components/RelatedContentGrid';
import LiveClock from '@/components/LiveClock';
import { getEditorialSections } from '@/lib/queries';

type ArticleLike = {
  id?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  isSponsored?: boolean;
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
  const editorialSections = await getEditorialSections();

  const heroArticle = latest[0]
    ? {
        id: latest[0].id ?? 1,
        slug: latest[0].slug ?? 'latest-news',
        title: latest[0].title ?? 'Latest news',
        excerpt: latest[0].excerpt ?? latest[0].description ?? '',
        category: latest[0].category ?? 'Top News',
        coverImage: latest[0].coverImage ?? '',
        isSponsored: latest[0].isSponsored,
        publishedAt: latest[0].publishedAt ? new Date(latest[0].publishedAt) : new Date(),
      }
    : undefined;

  const feedArticles = latest.slice(1, 6).map((article, index) => ({
    id: article.id ?? index + 2,
    slug: article.slug ?? `article-${index + 2}`,
    title: article.title ?? 'Latest news',
    category: article.category ?? 'Top News',
    excerpt: article.excerpt ?? article.description ?? '',
    coverImage: article.coverImage ?? '',
    isSponsored: article.isSponsored,
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
    <div className="min-h-screen w-full bg-background py-4 sm:py-8">
      <div className="flex w-full flex-col">
        <div className="mb-6 flex flex-col gap-4 border-y border-border/70 py-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] text-[#E2725B]">Beacon Hub / Daily Signal</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-black leading-none text-foreground sm:text-5xl">
              The world, edited with intent.
            </h1>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E2725B]" aria-hidden="true" />
            <span className="font-mono text-[10px]">LIVE / LAGOS</span>
            <LiveClock />
          </div>
        </div>
        <div className="mt-2 sm:mt-4 md:mt-6">
          <AsymmetricalHeroLayout
            article={heroArticle}
            feedArticles={feedArticles}
            logoUrl="/logo.png"
            headerAdLabel="Latest Signal"
          />
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
          <SectionHeaderComponent eyebrow="THE DESKS" title="Choose your signal" description="Move through the newsroom by subject, perspective, and pace." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {editorialSections.slice(0, 6).map((section: { id: number; name: string; description?: string | null; accentColor?: string | null; slug?: string | null }) => (
              <div
                key={section.id}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
              >
                <div className="mb-3 h-1 w-14 rounded-full" style={{ backgroundColor: section.accentColor || '#E2725B' }} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.name}</h3>
                {section.description ? (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{section.description}</p>
                ) : null}
                <Link href={`/category/${section.slug || section.name.toLowerCase()}`} className="mt-4 inline-flex text-sm font-semibold text-[#E2725B] hover:underline">
                  Explore section →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
          <RelatedContentGrid articles={moreStories} title="More Stories" limit={6} />
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
          <QuoteCard quote={quoteText} author={quoteAuthor} role="Editorial Briefing" />
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
          <RelatedContentGrid articles={trendingNow} title="Trending Now" limit={6} />
        </div>
      </div>
    </div>
  );
}