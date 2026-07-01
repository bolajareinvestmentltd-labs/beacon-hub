'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORIES = [
  { label: 'Top News', href: '/category/top-news' },
  { label: 'Global', href: '/category/global-news' },
  { label: 'Tech', href: '/category/tech' },
  { label: 'Deals', href: '/deals' },
  { label: 'Astro', href: '/horoscopes' },
  { label: 'Lifestyle', href: '/category/lifestyle' },
  { label: 'Sports', href: '/category/sports' },
];

export default function CategoryBar() {
  const pathname = usePathname() ?? '/';

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3">
        {CATEGORIES.map((category) => {
          const isActive =
            pathname === category.href || pathname.startsWith(`${category.href}/`);

          return (
            <Link
              key={category.label}
              href={category.href}
              aria-current={isActive ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                isActive
                  ? 'border-[#E2725B] bg-[#E2725B] text-white shadow-sm'
                  : 'border-slate-200/90 bg-slate-50 text-slate-800 hover:border-[#E2725B] hover:bg-[#E2725B]/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-[#E2725B]/10'
              }`}
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}