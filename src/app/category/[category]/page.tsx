import React from 'react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function DynamicCategoryPage({ params }: CategoryPageProps) {
  const rawCategory = params.category;
  const formattedCategory = decodeURIComponent(rawCategory)
    .replace(/-/g, ' ')
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F4EFEA] text-[#1A1A1A] px-6 pt-32 pb-16 transition-colors duration-300">
      {/* Sector Header Block */}
      <div className="max-w-6xl mx-auto border-b border-[#1A1A1A]/10 pb-6 mb-12">
        <span className="text-[10px] font-mono text-[#9C4A3A] uppercase tracking-widest font-bold">
          INTELLIGENCE SECTOR // {rawCategory.toUpperCase()}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#1A1A1A] mt-2">
          {formattedCategory}
        </h1>
        <p className="mt-4 text-base md:text-lg font-sans tracking-wide text-[#1A1A1A]/70 max-w-2xl leagues-relaxed">
          Active intelligence briefings, macroeconomic updates, and structural analysis mapped for the {formattedCategory.toLowerCase()} landscape.
        </p>
      </div>

      {/* Target Content Feed Frame */}
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-dashed border-[#1A1A1A]/20 rounded-sm p-12 flex flex-col items-center justify-center text-center bg-[#1A1A1A]/5 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-[#9C4A3A]/10 flex items-center justify-center mb-4">
            <span className="text-[#9C4A3A] font-bold text-xl">!</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] tracking-wide uppercase">
            Vault Sync Pending
          </h3>
          <p className="mt-2 text-sm text-[#1A1A1A]/60 max-w-sm font-sans leading-relaxed">
            Real-time feed connection establishing. GNews aggregation algorithms are initializing queries for this specialized sector.
          </p>
        </div>
      </div>
    </main>
  );
}
