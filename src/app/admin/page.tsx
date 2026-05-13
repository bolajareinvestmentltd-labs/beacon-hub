import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { publishArticle, deleteArticle } from "@/lib/actions";
import { Trash2, ShieldAlert, Upload } from "lucide-react";

export default async function AdminDashboard() {
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4">
      <header className="mb-12 border-b-2 border-black dark:border-white/20 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#E2725B] mb-2">
            <ShieldAlert size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Portal</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-black dark:text-[#F9F6F0]">Command Center</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 bg-slate-50 dark:bg-[#1C1C1E] p-6 md:p-8 border border-black/10 dark:border-white/10 rounded-xl shadow-sm h-fit">
          <h2 className="font-playfair text-2xl font-bold text-black dark:text-[#F9F6F0] mb-6">Manual Intel Override</h2>
          
          <form action={publishArticle} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Headline</label>
              <input name="title" required className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Sector</label>
                <select name="category" className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B]">
                  <option value="Global News">Global News</option>
                  <option value="Tech & Startups">Tech & Startups</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Author Identity</label>
                <input name="author" defaultValue="Beacon-Hub Intelligence" className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B]" />
              </div>
            </div>

            {/* THE NATIVE FILE PICKER */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Cover Image (Local Upload)</label>
              <input name="coverImage" type="file" accept="image/*" className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-slate-400 focus:outline-none focus:border-[#E2725B] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-slate-200 file:text-black hover:file:bg-slate-300 transition-all cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Brief Excerpt</label>
              <textarea name="excerpt" rows={2} className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B]"></textarea>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Full Briefing Body</label>
              <textarea name="content" required rows={8} className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B]"></textarea>
            </div>

            <button type="submit" className="mt-2 bg-black dark:bg-[#F9F6F0] hover:bg-[#E2725B] dark:hover:bg-[#E2725B] text-white dark:text-black hover:text-white font-black py-4 rounded-md transition-all duration-300 w-full uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2">
              <Upload size={16} /> Deploy Secure Payload
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 flex flex-col h-full">
          <h2 className="font-playfair text-2xl font-bold text-black dark:text-[#F9F6F0] mb-6 border-b border-black/10 dark:border-white/10 pb-4">Live Network Feed</h2>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[800px] pr-2">
            {allArticles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-[#1C1C1E] p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm flex items-start justify-between gap-4">
                <div className="flex-grow pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold text-[#3A7B7A] dark:text-[#4A9B9A] uppercase tracking-wider">{article.category}</span>
                  </div>
                  <h3 className="text-black dark:text-[#F9F6F0] font-bold text-sm leading-tight mb-2 font-playfair">{article.title}</h3>
                </div>
                <form action={async () => { "use server"; await deleteArticle(article.id); }}>
                  <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
