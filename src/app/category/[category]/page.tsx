import React from 'react';
import { getLiveNews } from '@/lib/news';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
  const rawCategory = params.category;
  const formattedCategory = decodeURIComponent(rawCategory)
    .replace(/-/g, ' ')
    .toUpperCase();

  // Fetch real live articles for this category from GNews
  const articles = await getLiveNews(rawCategory);

  return (
    <main className="min-h-screen bg-[#F4EFEA] text-[#1A1A1A] px-6 pt-32 pb-16">
      {/* Sector Header Block */}
      <div className="max-w-6xl mx-auto border-b border-[#1A1A1A]/10 pb-6 mb-12">
        <span className="text-[10px] font-mono text-[#9C4A3A] uppercase tracking-widest font-bold">
          LIVE INTELLIGENCE SECTOR // {rawCategory.toUpperCase()}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#1A1A1A] mt-2">
          {formattedCategory}
        </h1>
      </div>

      {/* Dynamic News Grid */}
      <div className="max-w-6xl mx-auto">
        {articles.length === 0 ? (
          <div className="border-2 border-dashed border-[#1A1A1A]/20 rounded-sm p-12 text-center bg-[#1A1A1A]/5">
            <h3 className="text-lg font-serif font-bold uppercase text-[#1A1A1A]">No Live Feed Available</h3>
            <p className="mt-2 text-sm text-[#1A1A1A]/60 max-w-sm mx-auto">
              We couldn't retrieve records for this sector right now. Verify your GNEWS_API_KEY environment configuration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                key={index}
                className="group block border border-[#1A1A1A]/10 bg-white/40 p-6 rounded-sm hover:border-[#9C4A3A]/40 transition-all duration-300"
              >
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 mb-4 rounded-sm"
                  />
                )}
                <span className="text-xs font-mono text-[#9C4A3A] font-bold block mb-2">
                  {article.source.name}
                </span>
                <h3 className="text-lg font-serif font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#9C4A3A] transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-[#1A1A1A]/70 font-sans line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
