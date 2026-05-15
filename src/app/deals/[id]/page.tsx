import { ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EscrowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dealId = parseInt(resolvedParams.id, 10);
  
  // Fetch the specific asset from Neon DB
  const assetResults = await db.select().from(deals).where(eq(deals.id, dealId));
  const asset = assetResults[0];

  // If someone types a random ID in the URL, trigger the Next.js 404 page
  if (!asset) {
    notFound();
  }

  // The locked JCLs platform processing logic
  const JCLS_FEE = asset.platformFee || 50;
  const TOTAL_PRICE = (asset.price || 0) + JCLS_FEE;

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <Link href="/deals" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#E2725B] transition-colors mb-8 inline-block">
        ← Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Asset Intelligence */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="w-full h-[400px] bg-slate-200 dark:bg-[#1C1C1E] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 relative">
            <img src={asset.imageUrl || ""} alt={asset.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock size={12} className="text-[#E2725B]" /> Verified Asset
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-[#E2725B] uppercase tracking-wider">{asset.category}</span>
              <span className="text-slate-400 text-[10px]">•</span>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Listed by {asset.vendorName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-6 leading-tight">
              {asset.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
              {asset.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: The Financial Engine */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-xl border border-black/10 dark:border-white/10 shadow-xl sticky top-24">
            
            <div className="flex items-center gap-2 text-black dark:text-[#F9F6F0] mb-6 border-b border-black/10 dark:border-white/10 pb-4">
              <ShieldCheck size={20} className="text-[#E2725B]" />
              <h2 className="font-playfair font-bold text-xl">Escrow Breakdown</h2>
            </div>

            <div className="flex flex-col gap-4 mb-6 text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                <span>Asset Principal</span>
                <span>₦{(asset.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                <span>JCLs Processing Fee</span>
                <span className="text-[#E2725B] font-bold text-lg">₦{JCLS_FEE}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-black p-4 rounded-lg border border-black/5 dark:border-white/5 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Secure Checkout</span>
                <span className="text-2xl font-black text-black dark:text-[#F9F6F0]">₦{TOTAL_PRICE.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-[#E2725B] hover:bg-[#c95b46] text-white font-black py-4 rounded-md transition-all duration-300 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 group">
              Initiate Secure Split <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 flex gap-3 text-[10px] text-slate-500 uppercase tracking-wider leading-relaxed">
              <AlertCircle size={16} className="shrink-0 text-[#E2725B]" />
              <p>Funds are held in secure JCLs Escrow until asset delivery is confirmed by both parties. Zero hidden charges.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}