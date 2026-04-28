import { getActiveListings } from "../../lib/queries";
import Link from "next/link";

export default async function DealsPage() {
  const listings = await getActiveListings();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Beacon-Hub Auto & Estates</h1>
          <p className="text-slate-400">Premium vehicles and real estate. Zero hidden fees.</p>
        </div>
        <span className="bg-emerald-600/20 text-emerald-400 text-sm font-bold px-4 py-2 rounded-full border border-emerald-500/30 w-fit">
          {listings.length} Active Listings
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 max-w-2xl mx-auto shadow-lg">
          <span className="text-5xl mb-4 block">🚗</span>
          <h2 className="text-xl font-bold text-white mb-2">Inventory Updating</h2>
          <p className="text-slate-400">Our agents are currently evaluating new stock. Check back shortly for premium listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors group flex flex-col shadow-lg">
              <div className="h-48 bg-slate-800 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                {item.type.toLowerCase() === "car" ? "🚙" : "🏠"}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{item.type}</span>
                  <span className="text-emerald-400 font-bold text-xl">₦{item.price.toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <button className="mt-auto w-full bg-slate-800 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors text-sm uppercase tracking-wide">
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
