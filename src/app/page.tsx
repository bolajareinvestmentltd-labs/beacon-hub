import Link from "next/link";
import { getHeroArticle, getLatestFeed } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch live data directly from Neon!
  const heroArticle = await getHeroArticle();
  const feedArticles = await getLatestFeed(10);

  // Time formatter helper
  const timeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `Updated ${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    return `Updated ${Math.floor(hours / 24)} days ago`;
  };

  // If the database is empty, show a clean fallback
  if (!heroArticle) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 font-playfair italic">
        Awaiting global intelligence feed...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 md:py-10">
      
      {/* 1. LIVE HERO SECTION */}
      <article className="mb-12 border-b-2 border-black dark:border-white/20 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-[#E2725B] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm mb-4 mt-8 inline-block">Latest Briefing</span>
          <span className="text-[10px] font-bold text-[#3A7B7A] uppercase tracking-wider">
            {heroArticle.category}
          </span>
        </div>
        
        <Link href={`/read/${heroArticle.slug}`}>
          <h1 className="text-4xl md:text-[3.5rem] font-black font-playfair leading-[1.1] mb-5 text-black dark:text-[#F9F6F0] hover:text-[#E2725B] transition-colors">
            {heroArticle.title}
          </h1>
        </Link>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6">
          {heroArticle.excerpt}
        </p>
        
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
          By {heroArticle.author} &bull; {heroArticle.publishedAt.toLocaleDateString()}
        </div>
      </article>

      {/* 2. THE LIVE HT MASONRY FEED */}
      <div className="flex flex-col">
        {feedArticles.map((article) => (
          <article 
            key={article.id} 
            className="py-6 border-b border-black/10 dark:border-white/10 flex gap-4 md:gap-8 group"
          >
            {/* Left: Content */}
            <div className="flex-1 flex flex-col justify-between">
              <Link href={`/read/${article.slug}`}>
                <h2 className="text-[1.35rem] md:text-2xl font-bold font-playfair leading-tight text-black dark:text-[#F9F6F0] group-hover:text-[#E2725B] transition-colors">
                  {article.title}
                </h2>
              </Link>
              
              <div className="flex items-center gap-2 mt-4 text-[11px] font-bold tracking-wide">
                <span className="text-[#3A7B7A] dark:text-[#4A9B9A] uppercase">{article.category}</span>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <span className="text-slate-500">{timeAgo(article.publishedAt)}</span>
              </div>
            </div>

            {/* Right: Live Image */}
            <Link href={`/read/${article.slug}`} className="block flex-shrink-0">
              <div className="w-[100px] h-[75px] md:w-[160px] md:h-[100px] bg-slate-200 dark:bg-white/5 rounded-md overflow-hidden relative border border-black/5 dark:border-white/5">
                {article.coverImage ? (
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"></div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

    </div>
  );
}