import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { publishArticle, deleteArticle } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch all articles to display in the manager
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <header className="mb-12 border-b-2 border-[#0A1128] pb-6">
        <h1 className="font-playfair text-4xl font-black text-[#0A1128]">Command Center</h1>
        <p className="text-slate-500 font-medium">Publish, edit, and manage the Beacon-Hub ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: THE PUBLISHER FORM */}
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm h-fit">
          <h2 className="font-playfair text-2xl font-bold text-[#0A1128] mb-6">Manual Override</h2>
         <form action={publishArticle} className="flex flex-col gap-4"> <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Headline</label>
              <input name="title" required className="w-full bg-[#FAFAFA] border border-slate-200 rounded-md px-4 py-3 text-[#0A1128] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" placeholder="Tech Giants Announce..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Desk / Category</label>
                <select name="category" className="w-full bg-[#FAFAFA] border border-slate-200 rounded-md px-4 py-3 text-[#0A1128] focus:outline-none focus:border-[#D4AF37]">
                  <option value="Politics">Politics</option>
                  <option value="Tech">Tech</option>
                  <option value="Markets">Markets</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Author</label>
                <input name="author" required className="w-full bg-[#FAFAFA] border border-slate-200 rounded-md px-4 py-3 text-[#0A1128] focus:outline-none focus:border-[#D4AF37]" placeholder="Senior Architect" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Article Body</label>
              <textarea name="content" required rows={6} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-md px-4 py-3 text-[#0A1128] focus:outline-none focus:border-[#D4AF37]" placeholder="Write the briefing here..."></textarea>
            </div>

            <button type="submit" className="mt-4 bg-[#0A1128] hover:bg-[#1a2b5e] text-white font-bold py-3.5 rounded-md transition-colors w-full uppercase tracking-widest text-sm">
              Publish to Network
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: THE FEED MANAGER */}
        <div className="bg-[#FAFAFA] p-8 border border-slate-200 rounded-xl">
          <h2 className="font-playfair text-2xl font-bold text-[#0A1128] mb-6 border-b border-slate-200 pb-4">Live Network Feed</h2>
          
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2">
            {allArticles.length === 0 ? (
              <p className="text-slate-500 text-sm">The network is currently empty.</p>
            ) : (
              allArticles.map((article) => (
                <div key={article.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start justify-between gap-4 group">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">{article.category}</span>
                    </div>
                    <h3 className="text-[#0A1128] font-bold text-sm leading-tight mb-1">{article.title}</h3>
                    <p className="text-slate-500 text-xs">By {article.author}</p>
                  </div>
                  
                  {/* The Kill Switch Form */}
                  <form action={async () => {
                    "use server";
                    await deleteArticle(article.id);
                  }}>
                    <button 
                      type="submit" 
                      className="text-slate-300 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50"
                      title="Delete Article"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}