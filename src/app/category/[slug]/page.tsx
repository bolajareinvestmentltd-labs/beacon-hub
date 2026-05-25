import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { Layers } from "lucide-react";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: any }) {
  const sql = neon(process.env.DATABASE_URL || "");
  
  // BUG FIX: Safely unwrap parameters for strict Next.js routing
  const { slug } = await Promise.resolve(params);
  const searchKeyword = `%${slug.split('-')[0]}%`;
  
  let articles: any[] = [];
  try {
    articles = await sql`
      SELECT * FROM articles 
      WHERE category ILIKE ${searchKeyword} 
      ORDER BY created_at DESC
    `;
  } catch (err) {
    console.error("Failed to load category", err);
  }

  const categoryName = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="border-b border-black/10 dark:border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="text-[#C85A32]" size={28} />
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-black dark:text-[#FDFDFB]">
              {categoryName}
            </h1>
          </div>
          <p className="text-sm font-serif text-slate-500 dark:text-slate-400 max-w-xl">
            Active intelligence briefings, updates, and deep-dive analysis for this sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((art) => (
              <Link key={art.id} href={`/read/${art.slug}`} className="group space-y-4 flex flex-col">
                <div className="w-full aspect-[16/10] bg-slate-100 dark:bg-[#121214] overflow-hidden rounded-sm relative border border-black/5 dark:border-white/5">
                  {art.image_url ? (
                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 font-mono text-[10px] tracking-widest">BEACON-HUB</div>
                  )}
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-mono text-[#C85A32] uppercase tracking-widest font-bold">
                    {art.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-black dark:text-white group-hover:text-[#C85A32] transition-colors leading-snug mt-2 line-clamp-3">
                    {art.title}
                  </h3>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 mt-auto">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                     {new Date(art.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 border border-dashed border-black/10 dark:border-white/10 rounded-sm">
              <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">NO DEPLOYED ARTICLES IN THIS SECTOR YET.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
