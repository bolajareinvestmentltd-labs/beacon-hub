'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { useState } from 'react';

type NewsNotification = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string | null;
  publishedAt?: string | Date | null;
};

function timeLabel(value?: string | Date | null) {
  if (!value) return 'Latest';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (!Number.isFinite(minutes)) return 'Latest';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}

export default function NewsNotificationRail({ articles }: { articles: NewsNotification[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  if (!articles.length) return null;

  return (
    <section className="my-7" aria-label="Latest headline alerts">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={15} className="text-primary" />
          <h2 className="font-mono text-[10px] text-foreground">LATEST ALERTS</h2>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Live feed</span>
      </div>
      <div className="space-y-2">
        {articles.map((article) => {
          const isExpanded = expanded === article.id;
          return (
            <article key={article.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex min-h-21 items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                  BH
                </span>
                <button type="button" onClick={() => setExpanded(isExpanded ? null : article.id)} aria-expanded={isExpanded} className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="max-w-40 truncate font-semibold text-foreground">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <time>{timeLabel(article.publishedAt)}</time>
                  </span>
                  <span className="mt-1 block line-clamp-2 text-sm font-bold leading-5 text-foreground sm:text-base">{article.title}</span>
                </button>
                <Link href={`/read/${article.slug}`} aria-label={`Read ${article.title}`} className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted sm:h-14 sm:w-20">
                  <Image src={article.coverImage || '/logo.png'} alt="" fill sizes="80px" unoptimized className="object-cover object-center" />
                </Link>
                <button type="button" onClick={() => setExpanded(isExpanded ? null : article.id)} aria-label={isExpanded ? 'Collapse alert' : 'Expand alert'} aria-expanded={isExpanded} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-foreground hover:bg-primary/10 hover:text-primary">
                  {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </button>
              </div>
              {isExpanded && (
                <div className="border-t border-border px-3 pb-4 pt-3 sm:px-4">
                  <p className="mb-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
                  <Link href={`/read/${article.slug}`} className="relative mb-3 block aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <Image src={article.coverImage || '/logo.png'} alt={article.title} fill sizes="(max-width: 768px) calc(100vw - 3rem), 720px" unoptimized className="object-cover object-center" />
                  </Link>
                  <Link href={`/read/${article.slug}`} className="text-sm font-bold text-primary hover:underline">Open full story</Link>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}