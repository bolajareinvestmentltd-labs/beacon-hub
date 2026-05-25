import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 600;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const sql = neon(process.env.DATABASE_URL || "");

  // 1. Fetch the main article
  let article;
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${params.slug} LIMIT 1`;
    article = result[0];
  } catch (err) {
    console.error("Database fetch failed", err);
  }

  if (!article) return notFound();

  // 2. Fetch 3 related/recent articles for the Stickiness Engine
  let relatedArticles: any[] = [];
  try {
    relatedArticles = await sql`
      SELECT id, title, slug, category, created_at, image_url 
      FROM articles 
      WHERE slug != ${params.slug}
      ORDER BY created_at DESC 
      LIMIT 3
    `;
  } catch (err) {
    console.error("Related fetch failed", err);
  }

  // Fallback Graphic Component for missing images
  const FallbackGraphic = () => (
    <div className="w-full h-full bg-slate-200 dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 flex items-center justify-center">
      <span className="text-slate-400 dark:text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
        Beacon-Hub
      </span>
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] pb-32">
      
      {/* 1. Header - Now Perfectly Centered */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-8 flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center text-xs font-mono font-bold tracking-widest uppercase text-slate-500 hover:text-[#C85A32] mb-8 transition-colors">
          <ArrowLeft size={14} className="mr-2" />
          Back to Feed
        </Link>
        
        <span className="text-[#C85A32] text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
          {article.category || "GLOBAL NEWS"}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-black dark:text-[#FDFDFB] mb-6">
          {article.title}
        </h1>
        
        {/* Render the Excerpt cleanly below the title */}
        {article.excerpt && (
          <p className="text-lg md:text-xl font-serif text-slate-600 dark:text-slate-400 italic mb-6 max-w-2xl">
            {article.excerpt}
          </p>
        )}
        
        <p className="text-xs font-mono text-slate-800 dark:text-slate-500 uppercase tracking-widest">
          BY JCLS EDITORIAL • {new Date(article.created_at).toLocaleDateString('en-US')}
        </p>
      </div>

      {/* 2. Hero Image */}
      <div className="w-full max-w-5xl mx-auto md:px-4 mb-12">
        <div className="w-full aspect-[16/9] md:rounded-sm overflow-hidden bg-slate-100 dark:bg-[#1C1C1E]">
           {article.image_url ? (
             <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
           ) : (
             <FallbackGraphic />
           )}
        </div>
      </div>

      {/* 3. The Article Content - High Contrast & Justified Alignment */}
      <article className="max-w-2xl mx-auto px-4 font-serif text-lg md:text-xl text-black dark:text-slate-300 leading-relaxed space-y-8 whitespace-pre-wrap text-justify">
        {article.content}
      </article>

      {/* 4. THE STICKINESS ENGINE: More Intelligence */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mt-24 pt-12 border-t border-black/10 dark:border-white/10">
          <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-black dark:text-white mb-8 text-center md:text-left">
            More Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel: any) => (
              <Link key={rel.id} href={`/read/${rel.slug}`} className="group flex flex-col gap-3">
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-sm bg-slate-100 dark:bg-[#1C1C1E]">
                  {rel.image_url ? (
                    <img 
                      src={rel.image_url} 
                      alt={rel.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <FallbackGraphic />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold leading-snug text-black dark:text-white group-hover:text-[#C85A32] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2">
                    {rel.category || "GLOBAL NEWS"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
