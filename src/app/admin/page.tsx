import { publishArticle, publishDeal } from "@/lib/actions";
import { ShieldCheck, Database, LineChart } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 min-h-screen">
      
      <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-8 flex items-center gap-4">
        <div className="bg-[#E2725B] text-white p-3 rounded-lg">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black font-playfair text-black dark:text-[#F9F6F0]">Command Center</h1>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Encrypted JCLs Connection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* =========================================
            LEFT COLUMN: NEWS PUBLISHER
            ========================================= */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <Database size={18} />
            <h2 className="text-lg font-bold font-playfair text-black dark:text-[#F9F6F0]">Manual Intel Override</h2>
          </div>

          <form action={publishArticle} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Headline</label>
              <input type="text" name="title" required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sector</label>
              <select name="category" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none">
                <option value="Top News">Top News</option>
                <option value="Elections 2026">Elections 2026</option>
                <option value="Global News">Global News</option>
                <option value="Tech & Startups">Tech & Startups</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Dev Log">Dev Log</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Cover Image</label>
              <input type="file" name="coverImage" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Brief Excerpt</label>
              <textarea name="excerpt" rows={2} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Full Briefing</label>
              <textarea name="content" rows={5} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <button type="submit" className="mt-2 bg-black dark:bg-[#F9F6F0] hover:bg-[#E2725B] dark:hover:bg-[#E2725B] text-white dark:text-black hover:text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px]">
              Deploy Intelligence
            </button>
          </form>
        </div>

        {/* =========================================
            RIGHT COLUMN: DEALS PUBLISHER
            ========================================= */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <LineChart size={18} />
            <h2 className="text-lg font-bold font-playfair text-black dark:text-[#F9F6F0]">Escrow Asset Deployment</h2>
          </div>

          <form action={publishDeal} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Name / Title</label>
              <input type="text" name="title" required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Vendor Name</label>
                <input type="text" name="vendorName" required placeholder="e.g. Ay'Smart" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Base Price (₦)</label>
                <input type="number" name="price" required placeholder="150000" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Category</label>
              <select name="category" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none">
                <option value="Real Estate">Real Estate</option>
                <option value="Vehicles & Autos">Vehicles & Autos</option>
                <option value="Tech & Gadgets">Tech & Gadgets</option>
                <option value="Fashion & Cosmetics">Fashion & Cosmetics</option>
                <option value="VIP Services">VIP Services</option>
                <option value="Digital Assets">Digital Assets</option>
                <option value="High-Ticket Products">High-Ticket Products</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Cover Image</label>
              <input type="file" name="coverImage" required accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Details / Contract Terms</label>
              <textarea name="description" rows={4} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <button type="submit" className="mt-2 bg-[#E2725B] hover:bg-[#c95b46] text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px]">
              List Assets to Network
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}