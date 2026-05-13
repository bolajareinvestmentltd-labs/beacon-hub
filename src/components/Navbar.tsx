"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { TAXONOMY } from "@/config/taxonomy";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#1C1C1E] border-b border-black/10 dark:border-white/10 shadow-sm transition-colors duration-300">
      
      {/* TOP TIER: Hamburger, Logo, CTA */}
      <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto w-full">
        
        {/* Left: Mobile Menu Trigger (Visual only for now, drawer is in MobileDock) & Search */}
        <div className="flex items-center space-x-4 w-1/3">
          <button className="md:hidden text-black dark:text-[#F9F6F0] hover:text-[#E2725B] transition-colors">
            <Menu size={24} strokeWidth={2} />
          </button>
          <button className="hidden md:block text-black dark:text-[#F9F6F0] hover:text-[#E2725B] transition-colors">
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Center: BH Logo */}
        <div className="flex justify-center w-1/3">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-black dark:text-[#F9F6F0] tracking-tighter uppercase font-playfair">
              Beacon<span className="text-[#E2725B]">-Hub</span>
            </span>
          </Link>
        </div>

        {/* Right: Subscribe / Get App CTA */}
        <div className="flex items-center justify-end w-1/3 space-x-4">
          <button className="md:hidden text-black dark:text-[#F9F6F0] hover:text-[#E2725B] transition-colors mr-2">
            <Search size={20} strokeWidth={2} />
          </button>
          <button className="text-[11px] md:text-xs font-bold uppercase tracking-wider border border-[#E2725B] text-[#E2725B] px-3 py-1.5 md:px-5 md:py-2 rounded-sm hover:bg-[#E2725B] hover:text-white transition-all duration-300">
            <span className="md:hidden">Get App</span>
            <span className="hidden md:inline">Subscribe</span>
          </button>
        </div>
      </div>

      {/* BOTTOM TIER: Horizontal Swipeable Categories (The HT Blueprint) */}
      <div className="w-full bg-slate-50 dark:bg-[#141415] border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="flex items-center px-2 md:px-4 h-12">
            {TAXONOMY.primary.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <li key={cat.name} className="flex-shrink-0">
                  <Link
                    href={cat.href}
                    className={`block px-4 py-3 text-[12px] md:text-[13px] font-bold tracking-wide transition-colors border-b-[3px] ${
                      isActive 
                        ? "text-[#E2725B] border-[#E2725B]" 
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