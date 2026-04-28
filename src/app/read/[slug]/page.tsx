import { getArticleBySlug } from "../../../lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

// ⚡ NEXT.JS 15 UPDATE: params must be typed as a Promise
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  
  // ⚡ NEXT.JS 15 UPDATE: We must await the params before reading the slug
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  // If someone types a random URL, send them to a 404 page
  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 flex flex-col gap-8 bg-slate-950 min-h-screen">
      
      {/* Back Button */}
      <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold mb-4 flex items-center gap-2 transition-colors w-fit">
        ← BACK TO FRONT PAGE
      </Link>
      
      {/* Article Header */}
      <div className="flex flex-col gap-6 border-b border-slate-800 pb-8">
        <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start border border-indigo-500/30">
          {article.category}
        </span>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>
        
        <p className="text-slate-400 font-medium flex items-center gap-3 mt-2">
          <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm border border-slate-700 uppercase font-bold text-emerald-400 shadow-inner">
            {article.author?.charAt(0) || "P"}
          </span>
          Published by <span className="text-slate-200 font-bold">{article.author}</span>
        </p>
      </div>
      
      {/* Article Body */}
      <div className="text-slate-300 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-medium pb-20">
        {article.content}
      </div>

    </article>
  );
}