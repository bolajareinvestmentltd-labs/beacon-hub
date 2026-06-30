"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Sparkles, Menu, X } from "lucide-react";

// Expanded to include your Zodiac/Horoscopes engine
const MASTER_CATEGORIES = [
  { name: "Top Stories", href: "/category/tech" },
  { name: "Global News", href: "/category/global" },
  { name: "Election 2026", href: "/category/election-2026", badge: "NG" },
  { name: "Daily Horoscope", href: "/horoscopes", badge: "NEW" },
  { name: "Sport", href: "/category/sport" },
  { name: "Entertainment", href: "/category/entertainment" },
  { name: "Start-ups", href: "/category/startups" },
  { name: "Real Estate", href: "/category/real-estate" },
  { name: "AI & Future Tech", href: "/category/ai" },
  { name: "Escrow Services", href: "/deals" },
];

export default function MobileDock() {
  const pathname = usePathname();
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  // 1. Standard scroll lock
  useEffect(() => {
    if (isTrayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isTrayOpen]);

  // 2. FAILSAFE: Force unlock body scroll if user clicks a link and page navigates
  useEffect(() => {
    document.body.style.overflow = "auto";
    setIsTrayOpen(false);
  }, [pathname]);

  return (
    <>
      {/* THE MASTER CATEGORY TRAY */}
      {isTrayOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="flex-1 w-full" onClick={() => setIsTrayOpen(false)} />
          
          <div className="bg-[#F9F6F0] dark:bg-[#121212] w-full rounded-t-[2rem] border-t border-neutral-300 dark:border-neutral-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-32 relative">
            
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-sans font-bold text-xs tracking-[0.2em] text-[#121212] dark:text-[#F9F6F0] uppercase">
                News Desk Directory<span className="text-[#C85A32] ml-1.5">•</span>
              </span>
              <button 
                onClick={() => setIsTrayOpen(false)} 
                aria-label="Close menu"
                className="p-2 rounded-full bg-neutral-200 dark:bg-[#1C1C1E] text-neutral-600 dark:text-neutral-400 hover:text-[#C85A32] transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-4 py-6 no-scrollbar">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                {MASTER_CATEGORIES.map((cat) => (
                  <Link 
                    key={cat.name} 
                    href={cat.href} 
                    onClick={() => setIsTrayOpen(false)} 
                    className="group flex items-center justify-between p-3.5 bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800/60 rounded-xl active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold tracking-tight text-[#121212] dark:text-[#F9F6F0] truncate">
                        {cat.name}
                      </span>
                      {cat.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black tracking-wider bg-[#C85A32]/15 text-[#C85A32] shrink-0">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE FLOATING MOBILE DOCK 
          Note: Elevated bottom-8 to escape Google AdSense Mobile Anchor frames 
      */}
      <div 
        data-nosnippet="true" 
        className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] w-[92%] max-w-[360px] bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-6 py-3"
      >
        <div className="flex justify-between items-center h-full">
          
          <Link href="/" className={`flex flex-col items-center justify-center space-y-1 transition-colors ${pathname === '/' ? 'text-[#C85A32]' : 'text-neutral-400 dark:text-neutral-500 hover:text-[#121212] dark:hover:text-[#F9F6F0]'}`}>
            <Home size={20} strokeWidth={pathname === '/' ? 2.5 : 2} />
            <span className={`text-[8px] font-sans font-bold tracking-widest uppercase ${pathname === '/' ? 'text-[#121212] dark:text-[#F9F6F0]' : ''}`}>Home</span>
          </Link>

          <Link href="/deals" className={`flex flex-col items-center justify-center space-y-1 transition-colors ${pathname.includes('/deals') ? 'text-[#C85A32]' : 'text-neutral-400 dark:text-neutral-500 hover:text-[#121212] dark:hover:text-[#F9F6F0]'}`}>
            <Briefcase size={20} strokeWidth={pathname.includes('/deals') ? 2.5 : 2} />
            <span className={`text-[8px] font-sans font-bold tracking-widest uppercase ${pathname.includes('/deals') ? 'text-[#121212] dark:text-[#F9F6F0]' : ''}`}>Deals</span>
          </Link>

          <Link href="/horoscopes" className={`flex flex-col items-center justify-center space-y-1 transition-colors ${pathname.includes('/horoscopes') ? 'text-[#C85A32]' : 'text-neutral-400 dark:text-neutral-500 hover:text-[#121212] dark:hover:text-[#F9F6F0]'}`}>
            <Sparkles size={20} strokeWidth={pathname.includes('/horoscopes') ? 2.5 : 2} />
            <span className={`text-[8px] font-sans font-bold tracking-widest uppercase ${pathname.includes('/horoscopes') ? 'text-[#121212] dark:text-[#F9F6F0]' : ''}`}>Astro</span>
          </Link>

          <button 
            onClick={() => setIsTrayOpen(!isTrayOpen)} 
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isTrayOpen ? 'text-[#C85A32]' : 'text-neutral-400 dark:text-neutral-500 hover:text-[#121212] dark:hover:text-[#F9F6F0]'}`}
          >
            <Menu size={20} strokeWidth={isTrayOpen ? 2.5 : 2} />
            <span className={`text-[8px] font-sans font-bold tracking-widest uppercase ${isTrayOpen ? 'text-[#121212] dark:text-[#F9F6F0]' : ''}`}>Menu</span>
          </button>

        </div>
      </div>
    </>
  );
}