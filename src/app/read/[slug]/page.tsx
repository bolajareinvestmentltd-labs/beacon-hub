import { getArticleBySlug, getRelatedArticles, incrementArticleViews } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditorialColumnComponent from "@/components/EditorialColumnComponent";
import RelatedContentGrid from "@/components/RelatedContentGrid";
import AdSense from "@/components/AdSense";
import { getReadingTimeString } from "@/lib/readingTime";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl?.startsWith("https://")
  ? configuredSiteUrl
  : "https://www.beacon-hub.com.ng";
const siteName = "Beacon Hub";
const fallbackImageUrl = new URL("/logo.png", siteUrl).toString();

function toAbsoluteUrl(value: string | undefined, fallback: string) {
  if (!value) return fallback;

  try {
    const url = new URL(value, siteUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function truncateDescription(value: string) {
  const description = value.replace(/\s+/g, " ").trim();
  return description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const articleUrl = new URL(`/read/${encodeURIComponent(slug)}`, siteUrl).toString();

  if (!article) {
    return {
      title: siteName,
      description: "World-class news journalism with premium editorial design",
      alternates: { canonical: articleUrl },
      openGraph: {
        title: siteName,
        description: "World-class news journalism with premium editorial design",
        url: articleUrl,
        siteName,
        type: "article",
        images: [{ url: fallbackImageUrl, width: 1200, height: 630, alt: `${siteName} logo` }],
      },
      twitter: {
        card: "summary_large_image",
        title: siteName,
        description: "World-class news journalism with premium editorial design",
        images: [fallbackImageUrl],
      },
    };
  }

  const title = String(article.title || siteName);
  const description = truncateDescription(
    String(article.metaDescription || article.excerpt || "Read the latest story from Beacon Hub.")
  );
  const imageUrl = toAbsoluteUrl(article.coverImage ? String(article.coverImage) : undefined, fallbackImageUrl);
  const author = article.author ? String(article.author) : "Beacon Hub Editorial Board";

  // Keep shared preview images under 300 KB; JPEG and PNG are the most reliable formats for WhatsApp.
  return {
    title,
    description,
    authors: [{ name: author }],
    alternates: { canonical: articleUrl },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [author],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const articleData = {
    id: Number(article.id),
    slug: String(article.slug || resolvedParams.slug),
    title: String(article.title || 'Article'),
    content: String(article.content || ''),
    authorPerspective: article.authorPerspective ? String(article.authorPerspective) : undefined,
    author: article.author ? String(article.author) : undefined,
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    excerpt: article.excerpt ? String(article.excerpt) : undefined,
    metaDescription: article.metaDescription ? String(article.metaDescription) : undefined,
    coverImage: article.coverImage ? String(article.coverImage) : undefined,
    category: article.category ? String(article.category) : 'General',
    wordCount: typeof article.wordCount === 'number' ? article.wordCount : undefined,
    seoKeywords: Array.isArray(article.seoKeywords) ? article.seoKeywords : [],
  };

  // Increment view count (fire and forget)
  try {
    await incrementArticleViews(String(articleData.id));
  } catch (error) {
    console.warn("Failed to track view:", error);
  }

  let relatedArticles = [] as any[];
  try {
    relatedArticles = await getRelatedArticles(articleData.id, 6);
  } catch (error) {
    console.warn("Failed to fetch related articles:", error);
  }

  // Calculate reading time from content
  const readingTime = getReadingTimeString(articleData.content);

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-black dark:to-slate-950 pb-24 md:pb-0">
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
              {articleData.category}
            </span>
          </div>
        </div>
      </div>

      {/* EDITORIAL HEADER */}
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 md:px-8 md:py-16">
        {/* Category Badge */}
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3A7B7A] dark:text-[#4A9B9A] inline-block mb-6">
          {articleData.category}
        </span>

        {/* Premium Title */}
        <h1 className="break-words text-[2.35rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-6">
          {articleData.title}
        </h1>

        {/* Byline & Metadata */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 pb-8 border-b-2 border-slate-300 dark:border-white/10">
          <div>
            <p className="text-sm font-serif text-slate-600 dark:text-slate-400">
              By{' '}
              <span className="font-bold text-black dark:text-white">
                {articleData.authorPerspective || articleData.author || "Editorial Board"}
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {articleData.publishedAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {readingTime}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {articleData.wordCount?.toLocaleString() || "Unknown"} words
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {articleData.coverImage && (
          <div className="my-12 md:my-16">
            <img
              src={articleData.coverImage}
              alt={articleData.title}
              className="w-full h-auto max-h-96 md:max-h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* ARTICLE CONTENT */}
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-8">
        <div className="content-area min-w-0 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 sm:p-6 md:rounded-3xl md:p-8">
          <EditorialColumnComponent
            title={articleData.title}
            content={articleData.content}
            accentColor="#E2725B"
          />
        </div>
      </div>

      {/* MID-STORY INTERSTITIAL AD */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-16">
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Sponsored Content</p>
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-[720px]">
            <AdSense adSlot="9999999999" adFormat="rectangle" label="Advertisement" />
          </div>
        </div>
      </div>

      {/* META INFO & SEO */}
      {articleData.metaDescription && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-12 p-6 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">{articleData.metaDescription}</p>
        </div>
      )}

      {/* KEYWORDS */}
      {articleData.seoKeywords.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-12 pt-12 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Related Keywords</p>
          <div className="flex flex-wrap gap-2">
            {articleData.seoKeywords.slice(0, 8).map((keyword: string, i: number) => (
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
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E2725B] mb-2">DISCOVER MORE</p>
          <h2 className="text-3xl md:text-4xl font-black font-playfair text-black dark:text-[#F9F6F0]">Related Stories</h2>
        </div>

        {relatedArticles.length > 0 ? (
          <RelatedContentGrid articles={relatedArticles} limit={6} />
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No related articles at this time.{' '}
            <Link href="/" className="text-[#E2725B] font-bold hover:underline">
              Return to home
            </Link>
            .
          </p>
        )}
      </div>

      {/* FOOTER CTA */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 my-16 py-16 text-center border-t-2 border-slate-200 dark:border-white/10">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Want more premium intelligence?</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#E2725B] text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#E2725B]/90 transition-all duration-300"
        >
          Back to Beacon Hub
        </Link>
      </div>
    </div>
  );
}

