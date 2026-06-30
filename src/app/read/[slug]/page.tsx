<<<<<<< HEAD
﻿import { getArticleBySlug, getRelatedArticles, incrementArticleViews } from "@/lib/queries";
=======
import { neon } from "@neondatabase/serverless";
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
import { notFound } from "next/navigation";
import Link from "next/link";
import EditorialColumnComponent from "@/components/EditorialColumnComponent";
import RelatedContentGrid from "@/components/RelatedContentGrid";
import AdPlacementManager from "@/components/AdPlacementManager";
import AdSense from "@/components/AdSense";
import { getReadingTimeString } from "@/lib/readingTime";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const revalidate = 600;

<<<<<<< HEAD
  if (!article) {
    notFound();
  }

  // Increment view count (fire and forget)
  try {
    await incrementArticleViews(article.id);
  } catch (error) {
    console.warn("Failed to track view:", error);
  }

  // Fetch related articles based on keyword matching
  let relatedArticles = [];
  try {
    relatedArticles = await getRelatedArticles(article.id, 6);
  } catch (error) {
    console.warn("Failed to fetch related articles:", error);
  }

  // Calculate reading time from content
  const readingTime = getReadingTimeString(article.content);

  return (
    <div className="w-full bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-black dark:to-slate-950">
      
      {/* Navigation Bar */}
      <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#E2725B] transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <ChevronLeft size={16} />
            Back to Hub
          </Link>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="hidden sm:inline">{readingTime}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
              {article.category}
            </span>
          </div>
        </div>
      </div>

      {/* EDITORIAL HEADER */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        
        {/* Category Badge */}
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3A7B7A] dark:text-[#4A9B9A] inline-block mb-6">
          {article.category}
        </span>

        {/* Premium Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-playfair leading-[1.1] text-black dark:text-[#F9F6F0] mb-6">
          {article.title}
        </h1>

        {/* Byline & Metadata */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 pb-8 border-b-2 border-slate-300 dark:border-white/10">
          <div>
            <p className="text-sm font-serif text-slate-600 dark:text-slate-400">
              By <span className="font-bold text-black dark:text-white">{article.authorPerspective || article.author || "Editorial Board"}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {article.publishedAt?.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {readingTime}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {article.wordCount?.toLocaleString() || 'Unknown'} words
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="my-12 md:my-16">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto max-h-96 md:max-h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* ARTICLE CONTENT - WITH MID-STORY AD */}
      <AdPlacementManager>
        <EditorialColumnComponent
          content={article.content}
          accentColor="#E2725B"
        />
      </AdPlacementManager>

      {/* MID-STORY INTERSTITIAL AD */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-16">
        <div className="text-center mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ADVERTISEMENT
          </p>
        </div>
        <div className="flex justify-center">
          <AdSense
            adSlot="9999999999"
            adFormat="rectangle"
          />
        </div>
      </div>

      {/* META INFO & SEO */}
      {article.metaDescription && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-12 p-6 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">
            {article.metaDescription}
          </p>
        </div>
      )}

      {/* KEYWORDS */}
      {article.seoKeywords && Array.isArray(article.seoKeywords) && article.seoKeywords.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-12 pt-12 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Related Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {article.seoKeywords.slice(0, 8).map((keyword: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RELATED CONTENT GRID */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-16 pt-12 border-t-2 border-slate-200 dark:border-white/10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E2725B] mb-2">
            DISCOVER MORE
          </p>
          <h2 className="text-3xl md:text-4xl font-black font-playfair text-black dark:text-[#F9F6F0]">
            Related Stories
          </h2>
        </div>
        
        {relatedArticles.length > 0 ? (
          <RelatedContentGrid articles={relatedArticles} limit={6} />
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No related articles at this time. <Link href="/" className="text-[#E2725B] font-bold hover:underline">Return to home</Link>.
          </p>
        )}
      </div>

      {/* FOOTER CTA */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-16 py-16 text-center border-t-2 border-slate-200 dark:border-white/10">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Want more premium intelligence?
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#E2725B] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#E2725B]/90 transition-all duration-300"
        >
          Back to Beacon Hub
        </Link>
      </div>

    </div>
=======
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
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
  );
}
