import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import NewsletterModal from "@/components/NewsletterModal";

export const revalidate = 60; 

export default async function Home() {
  // Fetch the latest 30 articles across the whole network
  const allArticles = await db.query.articles.findMany({
    orderBy: [desc(articles.createdAt)],
    limit: 30,
  });

  // The absolute newest article gets the Hero Spotlight
  const heroArticle = allArticles[0];
  
  // The rest get sorted into their specific desks
  const restArticles = allArticles.slice(1);
  
  // Helper function to pull exactly 3 articles for any given category
  const getDesk = (categoryName: string) => {
    return restArticles.filter(a => a.category === categoryName).slice(0, 3);
  };

  // Define our new media empire desks
  const desks = [
    { name: "Naija Politics", data: getDesk("Naija Politics") },
    { name: "Global Politics", data: getDesk("Global Politics") },
    { name: "Tech & Startups", data: getDesk("Tech & Startups") },
    { name: "Wealth & Real Estate", data: getDesk("Wealth & Real Estate") },
    { name: "Sports", data: getDesk("Sports") },
    { name: "Culture", data: getDesk("Culture") },
    { name: "Astro Desk", data: getDesk("Astro Desk") },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20">
      {/* THE 15-SECOND TRAP */}
      <NewsletterModal />

      {/* TOP TICKER & BRANDING */}
      <div className="w-full bg-slate-900 text-white text-[10px] sm:text-xs py-2 px-4 uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Beacon-Hub Global Intelligence</span>
        <span className="opacity-70 text-center">Lagos • London • New York</span>
      </div>

      {/* THE GLOBAL NAV BAR (Scrollable on mobile) */}
      <nav className="border-b border-slate-200 sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto hide-scrollbar">
          <ul className="flex items-center gap-6 sm:gap-8 py-4 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-500">
            {desks.map((desk) => (
              <li key={desk.name}>
                <Link href={`/category/${desk.name.replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-slate-900 transition-colors">
                  {desk.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* HERO SPOTLIGHT (The absolute latest breaking news) */}
        {heroArticle && (
          <div className="mb-16 border-b-2 border-slate-900 pb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider animate-pulse">
                Breaking
              </span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {heroArticle.category}
              </span>
            </div>
            <Link href={`/read/${heroArticle.slug}`} className="group">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 leading-tight mb-6 group-hover:text-slate-600 transition-colors">
                {heroArticle.title}
              </h1>
            </Link>
            <p className="font-sans text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-6 line-clamp-3">
              {heroArticle.content}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>By {heroArticle.author}</span>
              <span>•</span>
              <span>{new Date(heroArticle.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* THE DESKS (Iterating through all our new categories) */}
        <div className="flex flex-col gap-16">
          {desks.map((desk) => {
            // If the AI hasn't fetched articles for this desk yet, don't show the empty section
            if (desk.data.length === 0) return null;

            return (
              <section key={desk.name} className="border-t border-slate-200 pt-8">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-serif text-3xl font-black text-slate-900">
                    {desk.name}
                  </h2>
                  <Link href={`/category/${desk.name.replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                    View All →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {desk.data.map((article) => (
                    <article key={article.id} className="group flex flex-col">
                      <Link href={`/read/${article.slug}`}>
                        <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:underline decoration-2 underline-offset-4">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="font-sans text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                        {article.content}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </main>
  );
}