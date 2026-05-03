import { getArticleBySlug } from "../../../lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 pb-32">
      {/* Back Button */}
      <Link 
        href={`/category/${article.category}`} 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0A1128] transition-colors mb-8 uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to {article.category}
      </Link>

      {/* Header Info */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-black text-[#0A1128] leading-[1.1] mb-8">
          {article.title}
        </h1>

        <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#0A1128]">
            <span className="w-10 h-10 rounded-full bg-[#0A1128] text-[#FAFAFA] flex items-center justify-center text-sm">
              {article.author?.charAt(0) || "P"}
            </span>
            <div>
               <p className="m-0 leading-none mb-1">By {article.author}</p>
               <p className="text-xs text-slate-500 font-normal m-0 leading-none">Beacon-Hub {article.category} Desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg prose-slate max-w-none text-[#0A1128] leading-loose">
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-playfair mb-8">
          {article.content}
        </p>
        
        {/* Placeholder for future rich text rendering */}
        <p className="text-slate-600">
          (This is where the full rich-text content will render once we implement the advanced CMS editor. For now, we are displaying the raw content snippet.)
        </p>
      </div>
    </article>
  );
}
