import React from 'react';
import Link from 'next/link';
import QuoteCard from '@/components/QuoteCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] pb-28 md:pb-12">
      
      {/* HEADER HERO AREA */}
      <div className="max-w-6xl mx-auto pt-24 px-6 sm:px-12 pb-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-[#F9F6F0] tracking-tighter leading-none mb-4">
          BEACON<span className="text-[#C85A32]">•</span>HUB
        </h1>
        <p className="font-mono text-neutral-500 uppercase tracking-widest text-xs md:text-sm max-w-lg">
          The premium nexus for tech, real estate, and global trends.
        </p>
      </div>

      {/* DAILY QUOTE INTEGRATION (Engineering as Marketing) */}
      <QuoteCard 
        quote="Code is currency. Engineering is the purest form of marketing."
        author="Olowojare Muhammed"
        role="Product Architect & Digital Strategist"
      />

      {/* BENTO GRID DASHBOARD */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 mt-16">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-8">
           <h2 className="font-sans font-bold text-[#F9F6F0] uppercase tracking-[0.2em] text-sm">Top Stories</h2>
           <div className="flex items-center gap-2">
             <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Live Updates</span>
             <span className="flex h-2 w-2 rounded-full bg-[#C85A32] animate-pulse"></span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:auto-rows-[250px]">
          
          {/* Main Hero Block (Tech/Trending) */}
          <Link href="/category/tech" className="md:col-span-8 md:row-span-2 group relative bg-[#1C1C1E] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-300 flex flex-col justify-end p-8 min-h-[300px] md:min-h-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <div className="relative z-20">
              <span className="px-2 py-1 bg-[#C85A32] text-white text-[10px] font-bold uppercase tracking-widest mb-4 inline-block rounded-sm">Tech Trends</span>
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#F9F6F0] leading-tight group-hover:text-[#C85A32] transition-colors">
                The Next.js 15 Paradigm: Unmatched Speed for Real-Time Apps.
              </h3>
            </div>
          </Link>

          {/* Secondary Block 1 (Real Estate) */}
          <Link href="/category/real-estate" className="md:col-span-4 md:row-span-1 group bg-[#1C1C1E] border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between min-h-[200px] md:min-h-0">
            <span className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">Real Estate</span>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-[#F9F6F0] group-hover:text-[#C85A32] transition-colors">
              Redefining Real Estate: AI-Driven Urban Development.
            </h3>
          </Link>

          {/* Secondary Block 2 (Election 2026 Focus) */}
          <Link href="/category/election-2026" className="md:col-span-4 md:row-span-1 group bg-[#1C1C1E] border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between relative overflow-hidden min-h-[200px] md:min-h-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C85A32]/10 rounded-bl-full blur-2xl" />
            <span className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest flex justify-between">
              Election 2026 <span className="text-[#C85A32] font-black">NG</span>
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-[#F9F6F0] group-hover:text-[#C85A32] transition-colors">
              The Build-up to the Osun & Ekiti Gubernatorial Shifts.
            </h3>
          </Link>

        </div>
      </div>
    </main>
  );
}
