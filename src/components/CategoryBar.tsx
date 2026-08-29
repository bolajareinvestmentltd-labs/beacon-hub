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
    <div className="sticky top-0 z-40 border-b border-border/70 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
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
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/90 bg-muted/70 text-foreground hover:border-primary hover:bg-primary/10'
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