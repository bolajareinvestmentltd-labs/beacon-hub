'use client';

import { ReactNode } from 'react';
import { formatEditorialContent } from '@/lib/sanitize';

interface EditorialColumnComponentProps {
  title: string;
  content: string;
  author?: string;
  publishDate?: Date;
  excerpt?: string;
  coverImage?: string;
  children?: ReactNode;
  accentColor?: string;
}

export default function EditorialColumnComponent({
  title,
  content,
  author = 'Editorial Board',
  publishDate = new Date(),
  excerpt,
  coverImage,
  children,
  accentColor = '#E2725B',
}: EditorialColumnComponentProps) {
  const safeContent = formatEditorialContent(content || '');

  return (
    <article className="w-full max-w-4xl mx-auto py-6 md:py-10">
      {/* Premium margins with editorial styling */}
      <div className="px-4 md:px-8 lg:px-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Title - Serif typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-playfair leading-[1.1] mb-8 text-black dark:text-[#F9F6F0]">
            {title}
          </h1>

          {/* Excerpt - Refined styling */}
          {excerpt && (
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-serif mb-8 italic">
              {excerpt}
            </p>
          )}

          {/* Byline and Meta */}
          <div className="flex flex-col gap-2 py-6 border-y border-black/10 dark:border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              By <span className="text-black dark:text-white font-black">{author}</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {publishDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {coverImage && (
          <div className="w-full h-[350px] md:h-[500px] mb-12 rounded-lg overflow-hidden shadow-lg">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body - Editorial Column with wide white-space */}
        <div className="prose-editorial max-w-none mb-12">
          {safeContent ? (
            <div
              className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-loose font-serif space-y-8"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          ) : (
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-loose font-serif">
              {content || 'This story is being prepared for publication.'}
            </p>
          )}
        </div>

        {/* Pull Quotes or Callouts */}
        {children && <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">{children}</div>}

        {/* Accent line at bottom */}
        <div
          className="h-1 w-20 mt-12"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </article>
  );
}
