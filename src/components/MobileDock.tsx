"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Sparkles, Bookmark, Menu, X, ChevronRight } from "lucide-react";

export default function MobileDock() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => { setIsDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (isDrawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isDrawerOpen]);

  // Bottom Dock Core Navigation
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Trending", href: "/category/trending", icon: TrendingUp },
    { name: "Astro", href: "/horoscopes", icon: Sparkles },
    { name: "Saved", href: "/deals", icon: Bookmark }, 
  ];

  // The Hindustan Times Screenshot Blueprint Integration
  const primaryCategories = [
    "Global News", "Naija Politics", "Entertainment", "Trending", 
    "Videos", "Photos", "Sports", "Real Estate",
    "Astrology", "Lifestyle", "Education", "Cities"
  ];

  const editorialLinks = [
    "Daily Digest", "Quickreads", "Opinion", "Analysis", "Science", "Tech & Startups"
  ];

  return (
    <>
      {/* FULL SCREEN DRAWER */}
      <div className={`fixed inset-0 z-40 bg-[#1C1C1E] text-[#F9F6F0] transform transition-transform duration-500 ease-in-out flex flex-col md:hidden ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-4">
          <span className="text-2xl font-black tracking-wide font-playfair">Menu</span>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full bg-white/5 text-[#F9F6F0] hover:text-[#E2725B] transition-colors"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
          
          {/* Primary Two-Column Grid (Matches HT top links) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {primaryCategories.map((cat) => (
              <Link key={cat} href={`/category/${cat.toLowerCase().replace(/ & | /g, '-')}`} className="flex items-center justify-between group">
                <span className="font-bold text-sm tracking-wide group-hover:text-[#E2725B] transition-colors">{cat}</span>
              </Link>
            ))}
          </div>

          <hr className="border-white/10" />

          {/* Deep Dive / Editorial Section */}
          <div>
            <h3 className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4 font-bold">In-Depth</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {editorialLinks.map((link) => (
                <Link key={link} href={`/category/${link.toLowerCase().replace(/ & | /g, '-')}`} className="text-sm font-medium hover:text-[#E2725B] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Beacon-Hub Exclusives */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] text-[#E2725B] tracking-[0.2em] uppercase mb-4 font-bold">Beacon-Hub Exclusives</h3>
            <Link href="/deals" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <span className="font-medium text-sm">Special Deals</span>
              <ChevronRight size={16} className="text-[#E2725B]" />
            </Link>
            <Link href="/dev-log" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <span className="font-medium text-sm">Developer Log</span>
              <ChevronRight size={16} className="text-[#E2725B]" />
            </Link>
            <Link href="/admin" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <span className="font-medium text-sm">Admin Portal</span>
              <ChevronRight size={16} className="text-[#E2725B]" />
            </Link>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-28 w-full text-center p-6 border-t border-white/10 bg-[#1C1C1E]/95 backdrop-blur-md">
          <p className="text-[10px] text-[#F9F6F0]/50 tracking-[0.2em] uppercase">Engineered & Architected By</p>
          <p className="text-sm font-bold text-[#E2725B] mt-1.5 tracking-wide uppercase">JCLs (Jare's Choice Labs)</p>
        </div>
      </div>

      {/* MOBILE DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[95%] max-w-[400px]">
        <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-[2rem] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href && !isDrawerOpen;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isActive ? "bg-[#E2725B] text-[#F9F6F0] shadow-md" : "text-[#F9F6F0]/60 hover:text-[#F9F6F0] hover:bg-white/5"}`}>
                <Icon size={22} className={isActive ? "mb-0.5" : ""} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <span className="text-[10px] font-bold tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isDrawerOpen ? "bg-[#E2725B] text-[#F9F6F0] shadow-md" : "text-[#E2725B] hover:bg-[#E2725B]/10"}`}>
            {isDrawerOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </>
  );
}