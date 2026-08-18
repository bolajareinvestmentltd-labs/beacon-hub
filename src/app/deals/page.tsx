import Link from "next/link";
import { ShieldCheck, ArrowRight, Image as ImageIcon } from "lucide-react";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const listedDeals = await db
    .select()
    .from(deals)
    .where(eq(deals.isActive, true))
    .orderBy(desc(deals.createdAt));

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="border-b border-black/10 dark:border-white/10 pb-8 mb-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-black dark:text-[#FDFDFB] uppercase">
            Trust Network.
          </h1>
          <p className="text-base md:text-lg font-serif text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl text-justify">
            Exclusive assets and high-ticket services. All transactions are secured by the JCLs flat-fee escrow protocol, ensuring absolute trust between vendor and buyer.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[#C85A32]/30 bg-[#C85A32]/10 text-[#C85A32] text-xs font-mono font-bold tracking-widest uppercase">
            <ShieldCheck size={16} />
            JCLS Vault Active
          </div>
        </div>

        <div className="space-y-12">
          {listedDeals.map((deal) => (
            <div
              key={deal.id}
              className="group flex flex-col bg-slate-50 dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-slate-200 dark:bg-[#1C1C1E] relative overflow-hidden">
                {deal.imageUrl ? (
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-slate-400" size={32} />
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-3 py-1 rounded-sm uppercase tracking-widest border border-white/10">
                  AVAILABLE
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">
                      VENDOR: {deal.vendorName}
                    </p>
                    <h3 className="text-2xl font-serif font-bold text-black dark:text-white leading-tight">
                      {deal.title}
                    </h3>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-3xl font-serif font-black text-black dark:text-white tracking-tight">
                      ₦{deal.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-mono text-[#C85A32] uppercase tracking-widest mt-1 font-bold">
                      + ₦50 Flat Escrow Fee
                    </p>
                  </div>
                </div>

                <Link
                  href={`/deals/${deal.id}/checkout`}
                  className="flex items-center justify-center w-full md:w-auto md:inline-flex gap-2 bg-black dark:bg-[#FDFDFB] text-white dark:text-black px-8 py-4 rounded-sm font-mono text-xs font-bold tracking-widest uppercase hover:bg-[#C85A32] dark:hover:bg-[#C85A32] hover:text-white transition-colors"
                >
                  Initiate Secure Lock <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

