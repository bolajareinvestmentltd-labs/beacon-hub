import Link from 'next/link';

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
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 dark:text-slate-200">
        {CATEGORIES.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="whitespace-nowrap rounded-full border border-slate-200/90 bg-slate-50 px-4 py-2 text-slate-800 transition hover:border-[#E2725B] hover:bg-[#E2725B]/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-[#E2725B]/10"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}