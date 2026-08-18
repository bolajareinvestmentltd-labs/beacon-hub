'use client';

import { ReactNode } from 'react';
import { formatEditorialContent } from '@/lib/sanitize';

interface EditorialColumnComponentProps {
  title: string;
  content: string;
  children?: ReactNode;
  accentColor?: string;
}

export default function EditorialColumnComponent({
  title,
  content,
  children,
  accentColor = '#E2725B',
}: EditorialColumnComponentProps) {
  const safeContent = formatEditorialContent(content || '');

  return (
    <article className="w-full min-w-0 py-2 md:py-6">
      <div className="prose-editorial min-w-0 max-w-none mb-8">
          {safeContent ? (
            <div
              className="text-[1.08rem] sm:text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-[1.85] font-serif"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          ) : (
            <p className="text-[1.08rem] sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-[1.85] font-serif">
              {content || 'This story is being prepared for publication.'}
            </p>
          )}

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
