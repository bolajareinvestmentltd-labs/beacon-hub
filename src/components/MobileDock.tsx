"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tags, Sparkles, Menu, X } from "lucide-react";
import { TAXONOMY } from "@/config/taxonomy";

export default function MobileDock() {
  const pathname = usePathname();
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  return (
    <>
      {/* THE TRAY OVERLAY */}
      {isTrayOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#1C1C1E] w-full rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-28">
            <div className="flex justify-between items-center p-5 border-b border-black/10 dark:border-white/10">
              <span className="font-serif font-bold text-lg text-black dark:text-white">Directory</span>
              <button 
                onClick={() => setIsTrayOpen(false)}
                className="p-1 rounded-full bg-slate-100 dark:bg-[#2A2A2C] text-slate-500 hover:text-[#C85A32]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              <ul className="grid grid-cols-2 gap-2">
                {TAXONOMY.primary.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      onClick={() => setIsTrayOpen(false)}
                      className="block px-4 py-3 text-sm font-bold tracking-wide text-black dark:text-[#F9F6F0] rounded-lg active:bg-slate-100 dark:active:bg-[#2A2A2C]"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* THE FLOATING PILL DOCK */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-[#1C1C1E]/95 backdrop-blur-md text-white border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] px-6 py-3">
        <div className="flex justify-between items-center h-full">
          
          <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-white transition-colors" onClick={() => setIsTrayOpen(false)}>
            <Home size={20} className={pathname === '/' ? 'text-[#C85A32]' : ''} />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Feed</span>
          </Link>
          
          <Link href="/deals" className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-white transition-colors" onClick={() => setIsTrayOpen(false)}>
            <Tags size={20} className={pathname.includes('/deals') ? 'text-[#C85A32]' : ''} />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Deals</span>
          </Link>
          
          <Link href="/horoscopes" className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-white transition-colors" onClick={() => setIsTrayOpen(false)}>
            <Sparkles size={20} className={pathname.includes('/horoscopes') ? 'text-[#C85A32]' : ''} />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Astro</span>
          </Link>
          
          <button 
            onClick={() => setIsTrayOpen(!isTrayOpen)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isTrayOpen ? 'text-[#C85A32]' : 'text-slate-400 hover:text-white'}`}
          >
            <Menu size={20} />
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Menu</span>
          </button>

        </div>
      </div>
    </>
  );
}
