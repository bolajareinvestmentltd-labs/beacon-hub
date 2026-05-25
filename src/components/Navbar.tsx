"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Terminal } from "lucide-react";
import { TAXONOMY } from "@/config/taxonomy";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#1C1C1E] border-b border-black/10 dark:border-white/10 shadow-sm transition-colors duration-300">

      {/* TOP TIER: Logo Left, Utilities Right (NO HAMBURGER) */}
      <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto w-full">

        {/* Left: BH Logo firmly anchored */}
        <div className="flex items-center whitespace-nowrap">
          <Link href="/" className="flex flex-col items-start">
            <span className="text-2xl md:text-3xl font-black text-black dark:text-[#F9F6F0] tracking-tighter uppercase font-playfair">
              Beacon<span className="text-[#C85A32]">-Hub</span>
            </span>
          </Link>
        </div>

        {/* Right: Meta & CTA */}
        <div className="flex items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>

          <button className="text-black dark:text-[#F9F6F0] hover:text-[#C85A32] transition-colors md:hidden">
            <Search size={18} strokeWidth={2} />
          </button>

          <Link
            href="/dev-log"
            className="flex items-center gap-1 text-[10px] font-mono border border-black/10 dark:border-white/10 px-1.5 py-1 rounded-sm text-slate-500 hover:text-[#C85A32] hover:border-[#C85A32] hover:bg-[#C85A32]/5 transition-all bg-slate-50 dark:bg-black/50"
          >
            <Terminal size={12} className="text-[#C85A32]" />
            <span className="hidden lg:inline font-bold tracking-widest uppercase">v1.2.0</span>
          </Link>

          <button className="text-[10px] md:text-xs font-bold uppercase tracking-wider border border-[#C85A32] text-[#C85A32] px-3 py-1.5 rounded-sm hover:bg-[#C85A32] hover:text-white transition-all duration-300">
            <span className="md:hidden">Get App</span>
            <span className="hidden md:inline">Subscribe</span>
          </button>
        </div>
      </div>

      {/* BOTTOM TIER: Horizontal Categories Array */}
      <div className="w-full bg-slate-50 dark:bg-[#141415] border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="flex items-center px-4 h-12">
            {TAXONOMY.primary.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <li key={cat.name} className="flex-shrink-0">
                  <Link
                    href={cat.href}
                    className={`block px-4 py-3 text-[12px] md:text-[13px] font-bold tracking-wide transition-colors border-b-[3px] ${
                      isActive
                        ? "text-[#C85A32] border-[#C85A32]"
                        : "text-slate-600 dark:text-[#F9F6F0]/70 border-transparent hover:text-black dark:hover:text-[#F9F6F0]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    </header>
  );
}
