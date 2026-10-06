'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export type TrendingNewsItem = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
};

export default function TrendingNewsTicker({ items }: { items: TrendingNewsItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeItems = useMemo(
    () => items.filter((item) => item && item.slug && item.title).slice(0, 12),
    [items]
  );

  useEffect(() => {
    if (safeItems.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeItems.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [safeItems.length]);

  if (!safeItems.length) return null;

  const current = safeItems[activeIndex];

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface/95 shadow-[0_18px_80px_-48px_rgba(15,23,42,0.35)]">
      <div className="border-b border-border/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#E2725B]" aria-hidden="true" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Top headlines</p>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Link href={`/read/${current.slug}`} className="group block overflow-hidden rounded-[1.4rem] border border-border/70 bg-muted/40">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            {current.coverImage ? (
              <Image
                src={current.coverImage}
                alt={current.title}
                fill
                unoptimized
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-lg font-bold uppercase tracking-[0.3em] text-white/80">
                News
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <span>{current.category || 'Top News'}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Live</span>
            </div>
            <h3 className="text-xl font-black leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl lg:text-[2rem]">
              {current.title}
            </h3>
            {current.excerpt ? <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{current.excerpt}</p> : null}
          </div>
        </Link>

        <div className="flex flex-col justify-center gap-2">
          {safeItems.map((item, index) => (
            <Link
              key={`${item.id}-${item.slug}`}
              href={`/read/${item.slug}`}
              onMouseEnter={() => setActiveIndex(index)}
              className={`group flex items-start gap-3 rounded-2xl border p-3 transition-all ${
                index === activeIndex
                  ? 'border-[#E2725B]/60 bg-[#E2725B]/5 shadow-sm'
                  : 'border-border/70 bg-background/40 hover:border-primary/40 hover:bg-muted/40'
              }`}
            >
              <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#E2725B]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {item.category || 'Top News'}
                </p>
                <h4 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
