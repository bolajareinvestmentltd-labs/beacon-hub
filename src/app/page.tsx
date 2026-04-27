export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      
      {/* HERO SECTION: The Big Hook */}
      <section className="relative w-full h-80 md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-end p-6 md:p-10">
        {/* Dark gradient overlay so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-3xl">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Featured Dev Log
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            The Architect's Blueprint: Moving to a Decoupled Serverless Future
          </h1>
          <p className="text-slate-300 font-medium flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-slate-700">SA</span>
            By Senior Architect • April 27, 2026
          </p>
        </div>
      </section>

      {/* SPLIT BODY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN COLUMN (Articles & Content) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Latest Briefings</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All →</button>
          </div>
          
          {/* Article Card Placeholder 1 */}
          <article className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors cursor-pointer group">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 inline-block">Tech & Code</span>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors">Why React Server Components Change Everything</h3>
            <p className="text-slate-400 mb-4 line-clamp-2">A deep dive into how Next.js app router optimizes edge delivery for global audiences, reducing load times by over 40%.</p>
            <div className="text-sm text-slate-500 font-medium">Read Article →</div>
          </article>

          {/* Article Card Placeholder 2 */}
          <article className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors cursor-pointer group">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 inline-block">Real Estate</span>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors">Lagos Market Surge: Why Land Values are Tripling</h3>
            <p className="text-slate-400 mb-4 line-clamp-2">Analysis of the current economic shifts driving unprecedented growth in the Nigerian real estate sector.</p>
            <div className="text-sm text-slate-500 font-medium">Read Article →</div>
          </article>
        </div>

        {/* STICKY SIDEBAR (Ads & Subscriptions) */}
        <aside className="flex flex-col gap-8">
          
          {/* Native Ad Block (AySmart) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group cursor-pointer shadow-lg">
            <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] uppercase px-2 py-1 rounded-bl-lg font-bold z-10">Sponsored</div>
            <div className="w-12 h-12 bg-slate-800 rounded-full mb-4 flex items-center justify-center text-xl">🚗</div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Upgrade Your Ride Today</h3>
            <p className="text-sm text-slate-400 mb-6">AySmart Car Swap: Trade your old model for a 2026 upgrade. Zero hidden fees. Instant valuation.</p>
            <div className="inline-block bg-white text-slate-950 px-4 py-2 rounded-lg text-sm font-bold w-full text-center hover:bg-slate-200 transition-colors">View Inventory</div>
          </div>

          {/* Newsletter Block (Resend) */}
          <div className="bg-slate-900 border border-indigo-600/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(79,70,229,0.05)] relative overflow-hidden">
            {/* Soft glow effect behind the box */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white mb-2">The Daily Architect</h3>
            <p className="text-sm text-slate-400 mb-6">Get daily developer logs, market trends, and horoscopes sent directly to your inbox.</p>
            
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
                required
              />
              <button 
                type="button"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
              >
                Subscribe via Magic Link
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-4 text-center">No spam. Unsubscribe at any time.</p>
          </div>

        </aside>

      </div>
    </div>
  );
}
