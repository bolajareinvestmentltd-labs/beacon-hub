import { getActiveListings } from "@/lib/queries";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default async function DealsPage() {
  const listings = await getActiveListings();

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4">
      
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-black font-playfair tracking-tight text-black dark:text-[#F9F6F0]">
          The Marketplace
        </h1>
        <p className="mt-4 text-slate-500 max-w-lg mx-auto text-sm md:text-base">
          Exclusive assets, vetted vendors, and secure escrow transactions.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 border border-black/10 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5">
          <p className="text-slate-500 italic font-medium">The marketplace is currently updating inventory. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((deal) => (
            <div key={deal.id} className="group flex flex-col bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              
              {/* Image Container */}
              <div className="h-56 bg-slate-200 dark:bg-white/5 relative overflow-hidden border-b border-black/5 dark:border-white/5">
                {deal.imageUrl ? (
                  <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"></div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-[#F9F6F0] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm">
                  {deal.category}
                </div>
              </div>
              
              {/* Content Container */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-2 leading-tight group-hover:text-[#E2725B] transition-colors">
                    {deal.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 mb-4 uppercase tracking-[0.15em] font-bold">
                    Vendor: <span className="text-[#3A7B7A] dark:text-[#4A9B9A]">{deal.vendorName}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Pricing & Escrow Action */}
                <div className="border-t border-black/10 dark:border-white/10 pt-5 mt-auto">
                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <p className="text-3xl font-black text-black dark:text-[#F9F6F0] font-playfair">
                        ₦{deal.price?.toLocaleString()}
                      </p>
                      <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                        <ShieldCheck size={14} className="mr-1.5 text-[#E2725B]" />
                        + ₦{deal.platformFee} Flat Escrow
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-black dark:bg-[#F9F6F0] hover:bg-[#E2725B] dark:hover:bg-[#E2725B] text-white dark:text-black hover:text-white font-black text-[11px] uppercase tracking-[0.2em] py-4 rounded-sm transition-all duration-300">
                    Initiate Split
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
