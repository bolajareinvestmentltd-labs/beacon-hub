'use client';

import Link from 'next/link';
import Image from 'next/image';

interface RelatedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string | null;
  publishedAt: Date;
  authorPerspective?: string | null;
}

interface RelatedContentGridProps {
  articles: RelatedArticle[];
  title?: string;
  limit?: number;
}

export default function RelatedContentGrid({
  articles,
  title = 'Related Coverage',
  limit = 6,
}: RelatedContentGridProps) {
  const displayArticles = articles.slice(0, limit);

  return (
    <section className="mt-10 w-full border-t border-border pt-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-black font-playfair text-foreground md:text-4xl">
          {title}
        </h2>
        <div className="h-1 w-16 bg-primary" />
      </div>

      {/* Grid Layout: 3 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={`/read/${article.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/55 transition-all duration-300 hover:border-primary hover:bg-card/85 hover:shadow-xl"
          >
            {/* Card Container with hover effect */}
            <div className="relative h-44 overflow-hidden bg-muted md:h-52">
              {/* Thumbnail Image */}
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="app-gradient-cool flex h-full w-full items-center justify-center">
                  <span className="text-sm font-medium text-foreground/70">No Image</span>
                </div>
              )}

              {/* Category Badge Overlay */}
              <div className="absolute top-3 left-3">
                <span className="inline-block rounded-sm bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Headline */}
              <h3 className="mb-3 line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary md:text-base">
                {article.title}
              </h3>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="mb-4 line-clamp-2 flex-1 text-xs text-muted-foreground md:text-sm">
                  {article.excerpt}
                </p>
              )}

              {/* Footer: Author + Date */}
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-[11px] font-medium text-muted-foreground md:text-xs">
                <span className="truncate">
                  {article.authorPerspective || 'Editorial Board'}
                </span>
                <span className="text-right whitespace-nowrap">
                  {article.publishedAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {articles.length > limit && (
        <div className="mt-8 text-center">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-[#E2725B] transition-colors"
          >
            View All Stories
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
