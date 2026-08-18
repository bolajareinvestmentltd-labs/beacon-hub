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
  const [articleFormError, setArticleFormError] = useState<string | null>(null);

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

          <form
            action={articleAction}
            onSubmit={() => setArticleFormError(null)}
            onInvalid={() => setArticleFormError("Headline, excerpt, and full briefing are required.")}
            className="flex flex-col gap-5"
          >
            <div className="rounded-xl border border-[#E2725B]/15 bg-[#E2725B]/5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              Publish a fresh editorial brief to the site instantly.
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Headline</label>
              <input type="text" name="title" title="Article headline" placeholder="Enter the headline" required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sector</label>
              <select name="category" title="Article category" className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none">
                <option value="Top News">Top News</option>
                <option value="Elections 2027">Elections 2027</option>
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
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Briefing Image</label>
              <input type="file" name="bodyImage" title="Briefing body image" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer" />
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
            {articleFormError && (
              <p className="text-sm text-red-600 dark:text-red-400">{articleFormError}</p>
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
            <div className="rounded-xl border border-[#3A7B7A]/15 bg-[#3A7B7A]/5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              List a new asset or offer for the marketplace network.
            </div>
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

      <div className="mt-10 max-w-7xl mx-auto bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-playfair text-black dark:text-[#F9F6F0]">Published Article History</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review and edit the most recent published articles from the Beacon-Hub command center.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setHistoryError(null);
                fetch('/api/admin/articles', { credentials: 'same-origin' })
                  .then((response) => response.json())
                  .then((data) => setHistory(data.articles || []))
                  .catch(() => setHistoryError('Unable to refresh article history.'));
              }}
              className="rounded-full border border-[#E2725B] px-4 py-2 text-sm font-semibold text-[#E2725B] transition hover:bg-[#E2725B]/10"
            >
              Refresh
            </button>
          </div>
        </div>

        {historyError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {historyError}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
            No published articles are available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
              <thead className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-3">Headline</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Published</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">{item.title}</td>
                    <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(item.publishedAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-3 py-4 text-right space-x-2">
                      <a
                        href={`/admin/articles/${item.id}/edit`}
                        className="inline-flex items-center justify-center rounded-full border border-[#E2725B] px-4 py-2 text-xs font-semibold text-[#E2725B] transition hover:bg-[#E2725B]/10"
                      >
                        Edit
                      </a>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this article?')) {
                            return;
                          }

                          try {
                            const response = await fetch(`/api/admin/articles/${item.id}`, {
                              method: 'DELETE',
                              credentials: 'same-origin',
                            });

                            if (!response.ok) {
                              throw new Error('Failed to delete article');
                            }

                            setHistory(history.filter(h => h.id !== item.id));
                            setToastMessage('Article deleted successfully');
                            setTimeout(() => setToastMessage(null), 4000);
                          } catch (error) {
                            setToastMessage('Failed to delete article');
                            setTimeout(() => setToastMessage(null), 4000);
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-red-500 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
