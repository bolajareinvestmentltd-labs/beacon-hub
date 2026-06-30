'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface HeroArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  publishedAt: Date;
}

interface FeedArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
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
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-12 w-12 rounded-full border border-border/70 object-cover shadow-sm"
            />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-primary/90">
            New & Latest News
          </span>
        </div>

        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-foreground">
          Beacon Hub
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-7">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 w-full">
        <div className="lg:col-span-2">
          {story ? (
            <article className="rounded-[2rem] border border-border/80 bg-surface p-8 shadow-[0_18px_80px_-48px_rgba(15,23,42,0.3)]">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-primary text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Latest Briefing
                </span>
                <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider">
                  {story.category || 'Top Story'}
                </span>
              </div>

              {story.coverImage && (
                <Link href={`/read/${story.slug || ''}`}>
                  <div className="w-full h-[300px] md:h-[450px] mb-8 rounded-[1.75rem] overflow-hidden bg-muted relative group shadow-lg">
                    <img
                      src={story.coverImage}
                      alt={story.title || 'Headline Image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
              )}

              <Link href={`/read/${story.slug || ''}`}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-[1.05] mb-6 text-foreground hover:text-primary transition-colors">
                  {story.title || 'Intelligence Briefing Generating...'}
                </h2>
              </Link>

              {story.excerpt && (
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 font-sans max-w-3xl">
                  {story.excerpt}
                </p>
              )}

              {story.publishedAt && (
                <div className="text-[11px] font-mono font-medium uppercase tracking-widest text-muted-foreground">
                  {timeAgo(story.publishedAt)}
                </div>
              )}
            </article>
          ) : (
            <div className="w-full py-16 border border-border rounded-[2rem] bg-surface animate-pulse">
              <div className="h-4 bg-muted rounded w-32 mb-6" />
              <div className="w-full h-[350px] bg-muted rounded-[1.75rem] mb-8" />
              <div className="h-10 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
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