"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, Sparkles, Tags, X } from "lucide-react";
import { useState } from "react";

const MAIN_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Deals", href: "/deals", icon: Tags },
  { label: "Astro", href: "/horoscopes", icon: Sparkles },
];

const CATEGORY_LINKS = [
  { label: "Top News", href: "/category/top-news" },
  { label: "Global", href: "/category/global-news" },
  { label: "Tech", href: "/category/tech" },
  { label: "Lifestyle", href: "/category/lifestyle" },
  { label: "Sports", href: "/category/sports" },
];

export default function MobileDock() {
  const pathname = usePathname() ?? "/";
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 px-2 py-2 backdrop-blur md:hidden dark:border-white/10 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {MAIN_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition ${
                isActive(href)
                  ? "bg-[#E2725B] text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              <span className="mt-1">{label}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsTrayOpen(true)}
            className="flex flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Menu size={18} />
            <span className="mt-1">Menu</span>
          </button>
        </div>
      </div>

      {isTrayOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-800 dark:text-slate-100">
                Explore
              </p>
              <button
                type="button"
                onClick={() => setIsTrayOpen(false)}
                className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {CATEGORY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsTrayOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#E2725B] hover:bg-[#E2725B]/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
