'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

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
  logoUrl?: string;
  headerAdLabel?: string;
}

const SLIDE_INTERVAL_MS = 5000;

export default function AsymmetricalHeroLayout({
  article,
  heroArticle,
  feedArticles = [],
  headerAd,
}: AsymmetricalHeroLayoutProps) {
  const story = article || heroArticle || null;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = story ? [story, ...feedArticles] : [];
  const slideCount = slides.length;
  const current = slides[activeSlide % Math.max(slideCount, 1)];

  useEffect(() => {
    if (slideCount < 2 || isPaused) return;

    // Slide changes are a plain content swap (no motion), so they run even when the OS reports reduced motion.
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slideCount);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, activeSlide]);

  const goTo = (index: number) => setActiveSlide(((index % slideCount) + slideCount) % slideCount);


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

  if (!current) return null;

  return (
    <section
      className="w-full overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm"
      aria-label="Latest headlines"
      aria-roledescription="carousel"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setIsPaused(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setIsPaused(false); }}
      onFocusCapture={(event) => { if ((event.target as HTMLElement).matches(':focus-visible')) setIsPaused(true); }}
      onBlurCapture={() => setIsPaused(false)}
    >
      {headerAd ? <div className="border-b border-border/70 p-3 text-center">{headerAd}</div> : null}
      <article key={current.slug} className="grid min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <Link href={`/read/${current.slug}`} className="group relative block aspect-[16/9] min-h-0 overflow-hidden bg-muted lg:aspect-auto lg:min-h-[24rem]">
          {current.coverImage ? (
            <Image
              src={current.coverImage}
              alt={current.title}
              fill
              unoptimized
              priority={activeSlide === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-muted text-sm font-bold uppercase text-muted-foreground">Beacon Hub</div>
          )}
        </Link>

        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 lg:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-[0.16em]">
            <span className="text-primary">{current.category || 'Top News'}</span>
            <span className="text-muted-foreground">{current.isSponsored ? 'Sponsored' : 'Latest'}</span>
          </div>
          <Link href={`/read/${current.slug}`} className="group/title">
            <h2 className="line-clamp-4 text-2xl font-black leading-tight text-foreground transition-colors group-hover/title:text-primary sm:text-3xl lg:text-4xl">
              {current.title}
            </h2>
          </Link>
          {current.excerpt ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {current.excerpt}
            </p>
          ) : null}
          <p className="mt-5 font-mono text-[10px] text-muted-foreground">{timeAgo(current.publishedAt)}</p>
          <span className="sr-only" aria-live="polite">Headline {activeSlide + 1} of {slides.length}</span>
        </div>
      </article>
      {slideCount > 1 ? (
        <div className="flex items-center justify-center gap-2 border-t border-border/70 px-4 py-3" role="tablist" aria-label="Choose headline">
          {slides.map((slide, index) => (
            <button
              key={slide.slug}
              type="button"
              role="tab"
              aria-selected={index === activeSlide}
              aria-label={`Show headline ${index + 1}: ${slide.title}`}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground'}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}