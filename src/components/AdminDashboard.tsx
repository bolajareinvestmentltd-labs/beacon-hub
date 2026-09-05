"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { publishDeal } from "@/lib/actions";
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

type DealHistoryItem = {
  id: number;
  title: string;
  vendorName: string;
  category: string;
  price: number;
  createdAt: string;
};

type TrafficSummary = {
  todayVisitors: number;
  todayVisits: number;
  totalVisitors: number;
  totalVisits: number;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function AdminDashboard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ArticleHistoryItem[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [dealHistory, setDealHistory] = useState<DealHistoryItem[]>([]);
  const [dealHistoryError, setDealHistoryError] = useState<string | null>(null);
  const [articleFormError, setArticleFormError] = useState<string | null>(null);
  const [selectedCoverName, setSelectedCoverName] = useState<string>("");
  const [selectedBodyName, setSelectedBodyName] = useState<string>("");
  const [excerptLength, setExcerptLength] = useState(0);
  const [isArticleSubmitting, setIsArticleSubmitting] = useState(false);
  const [traffic, setTraffic] = useState<TrafficSummary | null>(null);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const articleFormRef = useRef<HTMLFormElement | null>(null);

  const [dealState, dealAction, isDealPending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      return await publishDeal(formData);
    },
    initialState
  );

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
    fetch("/api/admin/deals", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setDealHistory(data.deals || []))
      .catch(() => setDealHistoryError("Unable to load escrow asset history."));
  }, [dealState.success]);

  useEffect(() => {
    fetch('/api/admin/traffic', { credentials: 'same-origin' })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setTraffic(data))
      .catch(() => setTrafficError('Traffic data is unavailable.'));
  }, []);

  async function handleArticleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content = String(formData.get("content") || "").trim();

    if (!title || !excerpt || !content) {
      setArticleFormError("Please complete all required fields before publishing.");
      return;
    }

    setArticleFormError(null);
    setIsArticleSubmitting(true);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Please complete all required fields before publishing.");
      }

      setToastMessage(payload?.message || "Article published successfully.");
      form.reset();
      setSelectedCoverName("");
      setSelectedBodyName("");
      setExcerptLength(0);

      const historyResponse = await fetch("/api/admin/articles", {
        credentials: "same-origin",
      });
      if (historyResponse.ok) {
        const data = await historyResponse.json();
        setHistory(data.articles || []);
      }
    } catch (error) {
      setArticleFormError(error instanceof Error ? error.message : "Please complete all required fields before publishing.");
    } finally {
      setIsArticleSubmitting(false);
    }
  }

  return (
    <div className="admin-command-center w-full max-w-7xl mx-auto py-12 px-4 min-h-screen">
      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed top-24 right-4 z-[100] max-w-[calc(100vw-2rem)] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg dark:border-emerald-900/40 dark:bg-emerald-950/80 dark:text-emerald-300">
          {toastMessage}
        </div>
      )}

      <div className="admin-page-header mb-12 border-b border-black/10 dark:border-white/10 pb-8 flex items-center gap-4">
        <div className="admin-brand-mark bg-[#E2725B] text-white p-3 rounded-lg">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black font-playfair text-foreground">Command Center</h1>
          <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-secondary"></span>
            Encrypted JCLs Connection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="admin-panel bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="admin-section-heading flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <Database size={18} />
            <h2 className="text-lg font-bold font-playfair text-foreground">Manual Intel Override</h2>
          </div>

          <form
            ref={articleFormRef}
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleArticleSubmit}
            className="flex flex-col gap-5"
          >
            <div className="admin-callout rounded-xl border border-[#E2725B]/15 bg-[#E2725B]/5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              Publish a fresh editorial brief to the site instantly. Headline, Brief Excerpt, and Full Briefing are required before deployment.
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
              <input
                type="file"
                name="coverImage"
                title="Article cover image"
                accept="image/*"
                onChange={(event) => setSelectedCoverName(event.target.files?.[0]?.name || "")}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer"
              />
              {selectedCoverName && (
                <p className="mt-2 text-[11px] text-slate-400">Selected: {selectedCoverName}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Briefing Image</label>
              <input
                type="file"
                name="bodyImage"
                title="Briefing body image"
                accept="image/*"
                onChange={(event) => setSelectedBodyName(event.target.files?.[0]?.name || "")}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#E2725B]/10 file:text-[#E2725B] hover:file:bg-[#E2725B]/20 transition-all cursor-pointer"
              />
              {selectedBodyName && (
                <p className="mt-2 text-[11px] text-slate-400">Selected: {selectedBodyName}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Brief Excerpt</label>
                <span className="text-[10px] font-semibold text-slate-500">{excerptLength}/1000</span>
              </div>
              <textarea
                name="excerpt"
                title="Article excerpt"
                rows={3}
                required
                maxLength={1000}
                onChange={(event) => setExcerptLength(event.target.value.length)}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Full Briefing</label>
              <textarea name="content" title="Article content" rows={5} required className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#E2725B] outline-none" />
            </div>

            {articleFormError && (
              <p className="text-sm text-red-600 dark:text-red-400">{articleFormError}</p>
            )}

            <button type="submit" disabled={isArticleSubmitting} className="mt-2 bg-black dark:bg-[#F9F6F0] hover:bg-[#E2725B] dark:hover:bg-[#E2725B] text-white dark:text-black hover:text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px] disabled:cursor-not-allowed disabled:opacity-70">
              {isArticleSubmitting ? "Publishing..." : "Deploy Intelligence"}
            </button>
          </form>
        </div>

        <div className="admin-panel bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="admin-section-heading flex items-center gap-2 text-[#E2725B] mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            <LineChart size={18} />
            <h2 className="text-lg font-bold font-playfair text-foreground">Escrow Asset Deployment</h2>
          </div>

          <form action={dealAction} className="flex flex-col gap-5">
            <div className="admin-callout admin-callout-cool rounded-xl border border-[#3A7B7A]/15 bg-[#3A7B7A]/5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
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
            {dealState.success && dealState.message && (
              <p role="status" aria-live="polite" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                {dealState.message}
              </p>
            )}

            <button type="submit" disabled={isDealPending} className="mt-2 bg-[#E2725B] hover:bg-[#c95b46] text-white font-black py-4 rounded-md transition-colors duration-300 w-full uppercase tracking-[0.2em] text-[10px] disabled:cursor-not-allowed disabled:opacity-70">
              {isDealPending ? "Listing asset..." : "List Assets to Network"}
            </button>
          </form>
        </div>
      </div>

      <section className="admin-panel mt-10 rounded-2xl border p-6 shadow-xl md:p-8" aria-labelledby="traffic-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-secondary">Audience signal</p>
            <h2 id="traffic-heading" className="mt-1 text-xl font-bold font-playfair text-foreground">Site Traffic</h2>
          </div>
          <p className="text-xs text-muted-foreground">Anonymous first-party check-ins</p>
        </div>
        {trafficError ? (
          <p className="text-sm text-red-600 dark:text-red-300">{trafficError}</p>
        ) : traffic ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Today', traffic.todayVisitors, 'visitors'],
              ['Today views', traffic.todayVisits, 'page visits'],
              ['All-time', traffic.totalVisitors, 'unique visitors'],
              ['All-time views', traffic.totalVisits, 'page visits'],
            ].map(([label, value, detail]) => (
              <div key={String(label)} className="rounded-xl border border-border bg-muted/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-black text-foreground">{Number(value).toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading traffic data...</p>
        )}
      </section>

      <div className="admin-panel mt-10 max-w-7xl mx-auto bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-playfair text-foreground">Published Article History</h2>
            <p className="text-sm text-muted-foreground">
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

      <div className="admin-panel mt-10 max-w-7xl mx-auto bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="mb-6">
            <h2 className="text-xl font-bold font-playfair text-foreground">Escrow Asset History</h2>
          <p className="text-sm text-muted-foreground">Manage marketplace listings separately from editorial articles.</p>
        </div>
        {dealHistoryError ? (
          <p className="text-sm text-red-600">{dealHistoryError}</p>
        ) : dealHistory.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">No escrow assets have been listed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><tr><th className="px-3 py-3">Asset</th><th className="px-3 py-3">Vendor</th><th className="px-3 py-3">Price</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
              <tbody>{dealHistory.map((deal) => (
                <tr key={deal.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-4 font-semibold">{deal.title}</td>
                  <td className="px-3 py-4">{deal.vendorName}</td>
                  <td className="px-3 py-4">₦{deal.price.toLocaleString()}</td>
                  <td className="space-x-2 px-3 py-4 text-right">
                    <a href={`/admin/deals/${deal.id}/edit`} className="inline-flex rounded-full border border-[#E2725B] px-4 py-2 text-xs font-semibold text-[#E2725B]">Edit</a>
                    <button type="button" onClick={async () => { if (!window.confirm("Delete this escrow asset?")) return; const response = await fetch(`/api/admin/deals/${deal.id}`, { method: "DELETE", credentials: "same-origin" }); if (response.ok) setDealHistory((items) => items.filter((item) => item.id !== deal.id)); }} className="inline-flex rounded-full border border-red-500 px-4 py-2 text-xs font-semibold text-red-500">Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
