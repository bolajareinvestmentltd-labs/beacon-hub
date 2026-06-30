import Link from "next/link";
import { getArticlesByCategory } from "@/lib/queries";
import AdPlacementManager from "@/components/AdPlacementManager";

export const dynamic = 'force-dynamic';

// Chronological dateline formatting
const timeAgo = (date: Date) => {
  const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  return `Updated ${Math.floor(hours / 24)} days ago`;
};

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.name;
  
  const feedArticles = await getArticlesByCategory(categorySlug);
  const pageTitle = categorySlug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
      
      {/* Category Masthead Header */}
      <header className="mb-8 border-b-2 border-foreground pb-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-primary uppercase block mb-1">
            Section Desk
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-foreground">
            {pageTitle}
          </h1>
        </div>
        <span className="text-xs font-mono text-muted-foreground hidden sm:block">
          {feedArticles.length} {feedArticles.length === 1 ? 'Dispatch' : 'Dispatches'}
        </span>
      </header>

      {/* =========================================================================
          STATE A: UNPOPULATED DESK (Failsafe for Google AdSense Crawlers)
         ========================================================================= */}
      {feedArticles.length === 0 ? (
        <section className="my-12 p-8 md:p-12 bg-card border border-border rounded-2xl text-center max-w-2xl mx-auto shadow-xs">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
            <span className="text-2xl" role="img" aria-label="Satellite">📡</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
            Desk Currently Updating
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
            Our automated global news wire is actively monitoring upstream feeds for dispatches regarding <span className="font-semibold text-foreground">{pageTitle.toLowerCase()}</span>. Stories publish automatically upon verification.
          </p>

          <div className="border-t border-border/60 pt-6">
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-muted-foreground block mb-4">
              Explore Active Desks
            </span>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link 
                href="/category/tech" 
                className="px-4 py-2 rounded-lg bg-background border border-border hover:border-primary text-xs font-bold text-foreground transition-all"
              >
                Top Stories
              </Link>
              <Link 
                href="/category/global" 
                className="px-4 py-2 rounded-lg bg-background border border-border hover:border-primary text-xs font-bold text-foreground transition-all"
              >
                Global News
              </Link>
              <Link 
                href="/category/ai" 
                className="px-4 py-2 rounded-lg bg-background border border-border hover:border-primary text-xs font-bold text-foreground transition-all"
              >
                AI & Future Tech
              </Link>
              <Link 
                href="/horoscopes" 
                className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-300 transition-all"
              >
                ✨ Daily Horoscope
              </Link>
            </div>
          </div>
        </section>
      ) : (

        /* =========================================================================
            STATE B: POPULATED EDITORIAL STREAM
           ========================================================================= */
        <div className="flex flex-col divide-y divide-border/60">
          {feedArticles.map((article, index) => (
            <div key={article.id}>
              
              {/* Native Article Row */}
              <article className="py-8 flex flex-col sm:flex-row gap-6 group justify-between items-start">
                <div className="flex-1 flex flex-col justify-between self-stretch order-2 sm:order-1">
                  <div>
                    <Link href={`/read/${article.slug}`}>
                      <h2 className="text-xl md:text-2xl font-bold font-serif leading-snug text-foreground group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                    </Link>
                    {article.metaDescription && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                        {article.metaDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold tracking-wider uppercase">
                    <span className="text-primary">{article.category}</span>
                    <span className="text-border">&bull;</span>
                    <span className="text-muted-foreground font-medium">{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>

                <Link href={`/read/${article.slug}`} className="block w-full sm:w-[180px] h-[120px] shrink-0 order-1 sm:order-2">
                  <div className="w-full h-full bg-muted rounded-xl overflow-hidden relative border border-border/40">
                    {article.coverImage ? (
                      <img 
                        src={article.coverImage} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
                    )}
                  </div>
                </Link>
              </article>

              {/* In-Stream Monetization: Injects Ad after 3rd article */}
              {index === 2 && (
                <div className="my-6 py-4 bg-card/40 border-y border-border/60 rounded-xl overflow-hidden">
                  <AdPlacementManager zone="mid-story" />
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}