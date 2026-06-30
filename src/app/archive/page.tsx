import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { Database } from "lucide-react";

export const revalidate = 60;

export default async function ArchivePage() {
  const sql = neon(process.env.DATABASE_URL || "");
  
  let articles: any[] = [];
  try {
    articles = await sql`SELECT id, title, slug, category, created_at FROM articles ORDER BY created_at DESC`;
  } catch (err) {
    console.error("Failed to load archive", err);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="border-b border-black/10 dark:border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-[#C85A32]" size={24} />
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-black dark:text-[#FDFDFB]">
              Intelligence Archive
            </h1>
          </div>
          <p className="text-sm font-serif text-slate-500 dark:text-slate-400 max-w-xl">
            The complete, permanent registry of all global briefings, tech startup logs, and election analysis published on Beacon-Hub.
          </p>
        </div>

        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((art) => (
              <Link 
                key={art.id} 
                href={`/read/${art.slug}`} 
                className="group flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6 p-4 rounded-sm hover:bg-slate-50 dark:hover:bg-[#121214] border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all"
              >
                <div className="flex-grow space-y-1">
                  <h3 className="text-lg font-serif font-bold text-black dark:text-white group-hover:text-[#C85A32] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#C85A32] uppercase tracking-widest font-bold">
                    {art.category}
                  </span>
                </div>
                <div className="md:text-right shrink-0">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    {new Date(art.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-sm">
              <p className="text-sm font-mono text-slate-400">NO RECORDS FOUND IN THE ARCHIVE</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
