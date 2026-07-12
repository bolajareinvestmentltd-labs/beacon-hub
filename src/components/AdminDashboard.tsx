"use client";

import { useActionState, useEffect, useState } from "react";
import { publishArticle, publishDeal } from "@/lib/actions";
import { ShieldCheck, Database, LineChart } from "lucide-react";

type ActionState = {
  success: boolean;
  message: string;
};

type ArticleHistoryItem = {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function AdminDashboard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ArticleHistoryItem[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [articleState, articleAction, isArticlePending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      return await publishArticle(formData);
    },
    initialState
  );

  const [dealState, dealAction, isDealPending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      return await publishDeal(formData);
    },
    initialState
  );

  useEffect(() => {
    if (articleState.success && articleState.message) {
      setToastMessage(articleState.message);
      const timeout = window.setTimeout(() => setToastMessage(null), 4000);
      return () => window.clearTimeout(timeout);
    }
  }, [articleState]);

  useEffect(() => {
    if (dealState.success && dealState.message) {
      setToastMessage(dealState.message);
      const timeout = window.setTimeout(() => setToastMessage(null), 4000);
      return () => window.clearTimeout(timeout);
    }
  }, [dealState]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/api/admin/articles", {
          credentials: "same-origin",
        });
        if (!response.ok) {
          throw new Error("Could not load article history.");
        }

        const data = await response.json();
        setHistory(data.articles || []);
        setHistoryError(null);
      } catch (error) {
        setHistoryError("Unable to load published article history.");
      }
    }

    loadHistory();
  }, []);

  useEffect(() => {
    if (!articleState.success) return;

    async function refreshHistory() {
      try {
        const response = await fetch("/api/admin/articles", {
          credentials: "same-origin",
        });
        if (!response.ok) return;

        const data = await response.json();
        setHistory(data.articles || []);
      } catch {
        // Keep existing history if refresh fails.
      }
    }

    refreshHistory();
  }, [articleState.success]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 min-h-screen">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg dark:border-emerald-900/40 dark:bg-emerald-950/80 dark:text-emerald-300">
          {toastMessage}
        </div>
      )}

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
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <Database size={18} />
            <h2 className="text-lg font-bold font-playfair text-black dark:text-[#F9F6F0]">Manual Intel Override</h2>
          </div>

          <form action={articleAction} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Headline</label>
              <input type="text" name="title" title="Article headline" placeholder="Enter the headline" required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sector</label>
              <select name="category" title="Article category" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none">
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
              <input type="file" name="coverImage" title="Article cover image" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Brief Excerpt</label>
              <textarea name="excerpt" title="Article excerpt" rows={2} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Full Briefing</label>
              <textarea name="content" title="Article content" rows={5} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            {articleState.message && !articleState.success && (
              <p className="text-sm text-red-600 dark:text-red-400">{articleState.message}</p>
            )}

            <button type="submit" disabled={isArticlePending} className="mt-2 bg-black dark:bg-[#F9F6F0] hover:bg-[#E2725B] dark:hover:bg-[#E2725B] text-white dark:text-black hover:text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px] disabled:cursor-not-allowed disabled:opacity-70">
              {isArticlePending ? "Publishing..." : "Deploy Intelligence"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <LineChart size={18} />
            <h2 className="text-lg font-bold font-playfair text-black dark:text-[#F9F6F0]">Escrow Asset Deployment</h2>
          </div>

          <form action={dealAction} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Name / Title</label>
              <input type="text" name="title" title="Asset title" placeholder="Enter the asset name" required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Vendor Name</label>
                <input type="text" name="vendorName" title="Vendor name" required placeholder="e.g. Ay'Smart" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Base Price (₦)</label>
                <input type="number" name="price" title="Base price" required placeholder="150000" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Category</label>
              <select name="category" title="Asset category" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none">
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
              <input type="file" name="coverImage" title="Asset cover image" required accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Details / Contract Terms</label>
              <textarea name="description" title="Asset details" rows={4} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            {dealState.message && !dealState.success && (
              <p className="text-sm text-red-600 dark:text-red-400">{dealState.message}</p>
            )}

            <button type="submit" disabled={isDealPending} className="mt-2 bg-[#E2725B] hover:bg-[#c95b46] text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px] disabled:cursor-not-allowed disabled:opacity-70">
              {isDealPending ? "Listing asset..." : "List Assets to Network"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
