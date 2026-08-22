'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

interface HeroArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  isSponsored?: boolean;
  publishedAt: Date;
}

interface FeedArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  coverImage?: string;
  isSponsored?: boolean;
  publishedAt: Date;
}

interface AsymmetricalHeroLayoutProps {
  article?: HeroArticle;
  heroArticle?: HeroArticle;
  feedArticles?: FeedArticle[];
  headerAd?: ReactNode;
  headerAdLabel?: string;
  logoUrl?: string;
  logoAlt?: string;
}

export default function AsymmetricalHeroLayout({
  article,
  heroArticle,
  feedArticles = [],
  headerAd,
  headerAdLabel = 'Advertisement',
  logoUrl,
  logoAlt = 'Beacon Hub logo',
}: AsymmetricalHeroLayoutProps) {
  const story = article || heroArticle || null;

  const timeAgo = (date?: Date) => {
    if (!date) return '';
    try {
      const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
      if (minutes < 60) return `Updated ${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Updated ${hours}h ago`;
      return `Updated ${Math.floor(hours / 24)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5 sm:mb-6 text-center">
        <div className="mx-auto mb-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 rounded-full border border-border/70 object-cover shadow-sm"
            />
          )}
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.45em] text-primary/90">
            New & Latest News
          </span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-6xl font-black font-serif tracking-tight text-foreground">
          Beacon Hub
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-6 sm:leading-7">
          Fast-moving coverage, clear analysis, and the top stories shaping the day.
        </p>
      </div>

      {headerAd && (
        <div className="mb-8 w-full">
          <div className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2 text-center select-none">
            {headerAdLabel}
          </div>
          <div className="flex justify-center">{headerAd}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-[1.7fr_0.8fr] xl:grid-cols-3 xl:gap-10 w-full">
        <div className="lg:col-span-1 xl:col-span-2">
          {story ? (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Featured stories">
              {[story, ...feedArticles].map((item, index) => (
                <article key={`${item.id}-${item.slug}`} className="w-full min-w-full snap-start rounded-[2rem] border border-border/80 bg-surface p-4 shadow-[0_18px_80px_-48px_rgba(15,23,42,0.3)] sm:p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-6">
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm">
                      {item.isSponsored ? 'Sponsored' : index === 0 ? 'Latest Briefing' : 'Featured Story'}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                      {item.category || 'Top Story'}
                    </span>
                  </div>

                  {item.coverImage && (
                    <Link href={`/read/${item.slug || ''}`}>
                      <div className="relative mb-5 aspect-video max-h-64 w-full overflow-hidden rounded-[1.5rem] bg-muted shadow-lg sm:max-h-80 md:mb-6 md:aspect-[21/9] md:max-h-96">
                        <Image
                          src={item.coverImage}
                          alt={item.title || 'Headline Image'}
                          fill
                          unoptimized
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}

                  <Link href={`/read/${item.slug || ''}`}>
                    <h2 className="mb-4 text-lg font-bold leading-tight text-foreground transition-colors hover:text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                      {item.title || 'Intelligence Briefing Generating...'}
                    </h2>
                  </Link>

                  {item.excerpt && (
                    <p className="mb-5 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="text-[11px] font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    {timeAgo(item.publishedAt)}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 border border-border rounded-[2rem] bg-surface animate-pulse">
              <div className="h-4 bg-muted rounded w-32 mb-6" />
              <div className="w-full h-[350px] bg-muted rounded-[1.75rem] mb-6" />
              <div className="h-10 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          )}
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <div className="sticky top-6 lg:top-24">
            <div className="rounded-[1.75rem] border border-border/70 bg-surface p-6 shadow-sm">
              <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary mb-6">
                Latest Wire Updates
              </h2>

              {feedArticles.length > 0 ? (
                <div className="space-y-6 divide-y divide-border/40">
                  {feedArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/read/${item.slug || ''}`}
                      className="group block pt-4 first:pt-0 hover:translate-x-1 transition-transform"
                    >
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary block mb-1">
                        {item.category || 'News'}
                      </span>
                      <h3 className="text-sm font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">
                        {item.title || 'Untitled Dispatch'}
                      </h3>
                      {item.publishedAt && (
                        <span className="text-[10px] font-mono text-muted-foreground block">
                          {timeAgo(item.publishedAt)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No secondary updates incoming.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}