import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";
import { getFeaturedArticle, getLatestBriefings } from "../lib/queries";

export default async function Home() {
  const featuredPost = await getFeaturedArticle();
  const latestPosts = await getLatestBriefings();

  return (
    <div className="flex flex-col gap-12">
      
      {/* HERO SECTION: Sticky Political Post */}
      {featuredPost && (
        <Link href={`/read/${featuredPost.slug}`} className="relative w-full h-80 md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-end p-6 md:p-10 group cursor-pointer block hover:ring-2 hover:ring-indigo-500 transition-all">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10"></div>
          
          <div className="relative z-20 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                LATEST UPDATE
              </span>
              <span className="text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                READ MORE.. <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 group-hover:text-indigo-300 transition-colors">
              {featuredPost.title}
            </h1>
            <p className="text-slate-300 font-medium flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-slate-700 uppercase font-bold text-emerald-400">
                P
              </span>
              By {featuredPost.author} • Kwara State
            </p>
          </div>
        </Link>
      )}

      {/* SPLIT BODY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN COLUMN (Dynamic Articles Feed) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Latest Briefings</h2>
            <Link href="/category/all" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All →</Link>
          </div>
          
          {latestPosts.map((post) => (
            <article key={post.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-400 mb-4 line-clamp-2">
                {post.content}
              </p>
              <div className="text-sm text-slate-500 font-medium group-hover:text-indigo-400 transition-colors">READ MORE..</div>
            </article>
          ))}
        </div>

        {/* STICKY SIDEBAR (Ads & Subscriptions) */}
        <aside className="flex flex-col gap-8">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group cursor-pointer shadow-lg">
            {/* SPONSOR TAG: Commented out. Uncomment the div below to toggle back on later */}
            {/* <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] uppercase px-2 py-1 rounded-bl-lg font-bold z-10">Sponsored</div> */}
            
            <div className="w-12 h-12 bg-slate-800 rounded-full mb-4 flex items-center justify-center text-xl">🚗</div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Upgrade Your Ride Today</h3>
            <p className="text-sm text-slate-400 mb-6">Beacon-Hub Auto: Trade your old model for a 2026 upgrade. Zero hidden fees. Instant valuation.</p>
            <div className="inline-block bg-white text-slate-950 px-4 py-2 rounded-lg text-sm font-bold w-full text-center hover:bg-slate-200 transition-colors">View Inventory</div>
          </div>

          <div className="bg-slate-900 border border-indigo-600/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(79,70,229,0.05)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white mb-2">The Daily Architect</h3>
            <p className="text-sm text-slate-400 mb-6">Get daily developer logs, market trends, and horoscopes sent directly to your inbox.</p>
            
            <NewsletterForm />
          </div>

        </aside>
      </div>
    </div>
  );
}
