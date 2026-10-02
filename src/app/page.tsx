import Link from 'next/link';
import AsymmetricalHeroLayout from '@/components/AsymmetricalHeroLayout';
import SectionHeaderComponent from '@/components/SectionHeaderComponent';
import * as queries from '@/lib/queries';
import QuoteCard from '@/components/QuoteCard';
import RelatedContentGrid from '@/components/RelatedContentGrid';
import LiveClock from '@/components/LiveClock';
import type { Metadata } from 'next';
import { getArticles, getArticlesByCategory, getEditorialSections } from '@/lib/queries';
import { TAXONOMY } from '@/config/taxonomy';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://')
  ? process.env.NEXT_PUBLIC_SITE_URL
  : 'https://www.beacon-hub.com.ng';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackImage = new URL('/logo.png', siteUrl).toString();
  const latestArticle = (await getArticles(1))[0];
  const title = latestArticle?.title
    ? `${latestArticle.title} | Beacon Hub`
    : 'Beacon Hub - Premium News Platform';
  const description = latestArticle?.excerpt || 'World-class news journalism with premium editorial design';
  const image = latestArticle?.coverImage || fallbackImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'Beacon Hub',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

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
  const categoryFeeds = await Promise.all(
    TAXONOMY.primary
      .filter((section) => section.href.startsWith('/category/'))
      .map(async (section) => ({
        ...section,
        articles: await getArticlesByCategory(section.href.split('/').pop() || '', 4),
      }))
  );

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
          {categoryFeeds.map((section) => (
            <section key={section.href} className="border-t border-border/80 py-7 sm:py-9">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] text-[#E2725B]">LIVE DESK</p>
                  <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">{section.name}</h2>
                </div>
                <Link href={section.href} className="shrink-0 text-xs font-bold text-[#E2725B] hover:underline">
                  All {section.name}
                </Link>
              </div>
              {section.articles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {section.articles.map((article) => (
                    <Link key={article.id} href={`/read/${article.slug}`} className="group min-w-0 border-b border-border/70 pb-4">
                      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={article.coverImage || '/logo.png'}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="mb-1 font-mono text-[9px] text-muted-foreground">{article.category}</p>
                      <h3 className="line-clamp-3 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{article.excerpt}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">This desk is warming up. New headlines arrive with the next feed update.</p>
              )}
            </section>
          ))}
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