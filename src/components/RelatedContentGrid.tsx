'use client';

import Link from 'next/link';

interface RelatedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  publishedAt: Date;
  authorPerspective?: string;
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
    <section className="w-full mt-10 pt-8 border-t border-black/10 dark:border-white/10">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-2">
          {title}
        </h2>
        <div className="h-1 w-16 bg-[#E2725B]" />
      </div>

      {/* Grid Layout: 3 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={`/read/${article.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#E2725B] hover:shadow-xl transition-all duration-300"
          >
            {/* Card Container with hover effect */}
            <div className="relative overflow-hidden h-44 md:h-52 bg-slate-200 dark:bg-white/5">
              {/* Thumbnail Image */}
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">No Image</span>
                </div>
              )}

              {/* Category Badge Overlay */}
              <div className="absolute top-3 left-3">
                <span className="inline-block bg-[#E2725B] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Headline */}
              <h3 className="text-sm md:text-base font-bold text-black dark:text-white group-hover:text-[#E2725B] transition-colors line-clamp-2 mb-3">
                {article.title}
              </h3>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                  {article.excerpt}
                </p>
              )}

              {/* Footer: Author + Date */}
              <div className="flex items-center justify-between gap-2 text-[11px] md:text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-3">
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
                className="w-5 h-5 text-[#E2725B]"
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
