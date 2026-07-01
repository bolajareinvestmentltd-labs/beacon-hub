'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Tags, Menu, X } from 'lucide-react';

const PRIMARY_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/category/top-news', icon: Tags },
  { label: 'Astrology', href: '/horoscopes', icon: Sparkles },
];

const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Deals', href: '/deals' },
];

const CATEGORY_LINKS = [
  { label: 'Top News', href: '/category/top-news' },
  { label: 'Global', href: '/category/global-news' },
  { label: 'Tech', href: '/category/tech' },
  { label: 'Lifestyle', href: '/category/lifestyle' },
];

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];

export default function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="border-t border-slate-200/70 bg-white/95 text-slate-700 dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-6 lg:flex-row lg:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2725B] text-sm font-black uppercase tracking-[0.3em] text-white">
              BH
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white">Beacon Hub</p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Premium News Platform
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Fast-moving coverage, expert analysis, and clean design for readers who want the latest
            news without the noise.
          </p>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-[#E2725B]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Categories
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-[#E2725B]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Follow
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-[#E2725B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/70 bg-slate-50/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Beacon Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-[#E2725B]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#E2725B]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
