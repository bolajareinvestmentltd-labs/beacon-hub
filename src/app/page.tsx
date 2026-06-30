import Link from 'next/link';
import { getArticles, getFeaturedArticles, getBreakingNews } from '@/lib/queries';
import AsymmetricalHeroLayout from '@/components/AsymmetricalHeroLayout';
import SectionHeaderComponent from '@/components/SectionHeaderComponent';
import AdPlacementManager from '@/components/AdPlacementManager';
import { premiumClasses } from '@/lib/premiumStyles';
import { latestNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const allArticles = await getPublishedArticles();
  const newest = latestNews(allArticles, 6);
  const heroArticle = newest[0];
  const feedArticles = newest.slice(1);

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* Top Banner Ad Zone */}
      <div className="w-full border-b border-border/60 bg-card/50 py-3">
        <AdPlacementManager zone="header" />
      </div>

      {/* THE MASTER INSTITUTIONAL 3-COLUMN DESK */}
      <main className={`${premiumClasses.container} py-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              COLUMN 1: THE QUICK WIRE (Left - 3 Cols on Desktop)
             ========================================================= */}
          <aside className="lg:col-span-3 lg:border-r lg:border-border/80 lg:pr-6 order-2 lg:order-1">
            <div className="flex items-center justify-between pb-3 border-b-2 border-primary mb-4">
              <h2 className="font-sans font-black text-xs tracking-[0.2em] uppercase text-foreground">
                The Quick Wire
              </h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>

            {breakingNews.length > 0 ? (
              <div className="divide-y divide-border/50">
                {breakingNews.slice(0, 5).map((story) => (
                  <Link
                    key={story.id}
                    href={`/read/${story.slug}`}
                    className="group block py-3.5 hover:translate-x-1 transition-transform"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {story.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors mt-0.5">
                      {story.title}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-4">Wire currently quiet.</p>
            )}
          </aside>


          {/* =========================================================
              COLUMN 2: THE FLAGSHIP LEAD (Center - 6 Cols on Desktop)
             ========================================================= */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            {heroArticle ? (
              <div className="pb-8 border-b border-border/80">
                <AsymmetricalHeroLayout article={heroArticle} />
              </div>
            ) : null}

            {/* Editor's Picks Sub-stream */}
            {featuredArticles.length > 0 && (
              <div className="pt-8">
                <SectionHeaderComponent
                  eyebrow="CURATED"
                  title="Editor's Picks"
                  description="Handpicked reporting from our senior desks"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/read/${article.slug}`}
                      className="group flex flex-col justify-between bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-md transition-all"
                    >
                      {article.featuredImage && (
                        <div className="relative w-full h-40 overflow-hidden bg-muted">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                            {article.category}
                          </p>
                          <h4 className="font-serif font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                            {article.metaDescription}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium pt-4 mt-4 border-t border-border/40 block">
                          By {article.author}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>


          {/* =========================================================
              COLUMN 3: MONETIZATION & ASTRO (Right - 3 Cols on Desktop)
             ========================================================= */}
          <aside className="lg:col-span-3 lg:border-l lg:border-border/80 lg:pl-6 order-3 space-y-8">
            
            {/* Native Sidebar Ad Container */}
            <div className="sticky top-24 bg-card border border-border/80 rounded-xl p-4 text-center">
              <span className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground block mb-2">
                Advertisement
              </span>
              <AdPlacementManager zone="sidebar" />
            </div>

            {/* Daily Horoscope Teaser Widget */}
            <div className="bg-gradient-to-br from-purple-950/10 via-card to-card border border-purple-500/20 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-3">
                <span className="font-sans font-bold text-xs tracking-widest uppercase text-purple-600 dark:text-purple-400">
                  ✨ Astro Desk
                </span>
                <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full">
                  Daily
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Rolling astrological charts and daily readings for all 12 zodiac signs.
              </p>
              <Link
                href="/horoscopes"
                className="block w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-center font-sans font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                Read Your Sign &rarr;
              </Link>
            </div>

          </aside>

        </div>
      </main>

      {/* Mid-Stream Interstitial Ad */}
      <div className="w-full bg-card/40 border-y border-border/60 py-6 my-6">
        <div className="max-w-3xl mx-auto px-4">
          <AdPlacementManager zone="mid-story" />
        </div>
      </div>

      {/* LATEST STORIES STREAM (Full Width Below Grid) */}
      {allArticles && allArticles.length > 0 && (
        <section className={`${premiumClasses.container} py-12`}>
          <SectionHeaderComponent
            eyebrow="THE WIRE"
            title="All Stories"
            description="Chronological reporting from across the globe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {allArticles.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/read/${article.slug}`}
                className="group flex flex-col bg-card border border-border/60 rounded-xl overflow-hidden hover:border-border transition-colors"
              >
                {article.featuredImage && (
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1.5">
                      {article.category}
                    </p>
                    <h3 className="font-serif font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2.5 leading-relaxed">
                      {article.metaDescription}
                    </p>
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground pt-4 mt-4 border-t border-border/40">
                    By {article.author}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer Newsletter Module */}
      <section className="w-full bg-card border-t border-border py-16 mt-12">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="font-serif font-bold text-3xl text-foreground mb-3">Beacon Hub Direct</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Institutional journalism, market analysis, and astrological briefings delivered straight to your inbox.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-2.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}