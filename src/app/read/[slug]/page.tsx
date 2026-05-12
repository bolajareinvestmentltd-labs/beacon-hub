import { getArticleBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  // If the URL is wrong or article doesn't exist, Next.js automatically shows a 404
  if (!article) {
    notFound();
  }

  return (
    <article className="w-full max-w-3xl mx-auto py-6 md:py-10">
      
      {/* Utility Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#E2725B] transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Briefing
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-[#3A7B7A] uppercase tracking-widest">
            {article.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-playfair leading-[1.1] mb-6 text-black dark:text-[#F9F6F0]">
          {article.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4 py-4 border-y border-black/10 dark:border-white/10">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            By <span className="text-black dark:text-[#F9F6F0]">{article.author}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {article.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.coverImage && (
        <div className="w-full h-[250px] md:h-[400px] mb-10 bg-slate-200 dark:bg-white/5 rounded-xl overflow-hidden">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      {/* Note: We use prose class if you have @tailwindcss/typography installed, otherwise standard styling */}
      <div className="text-lg text-slate-800 dark:text-slate-300 leading-loose space-y-6">
        <p>{article.content}</p>
        {/* If the content was HTML from a rich text editor, you'd use dangerouslySetInnerHTML here */}
      </div>

    </article>
  );
}