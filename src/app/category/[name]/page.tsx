import { getArticlesByCategory } from "../../../lib/queries";
import Link from "next/link";

// ⚡ NEXT.JS 15 UPDATE: params must be a Promise
export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  
  // The URL gives us "%20" for spaces, so we decode it (e.g., "Dev Log")
  const categoryName = decodeURIComponent(resolvedParams.name);
  const articles = await getArticlesByCategory(categoryName);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white capitalize">
          {categoryName} Desk
        </h1>
        <span className="bg-indigo-600/20 text-indigo-400 text-sm font-bold px-3 py-1 rounded-full border border-indigo-500/30">
          {articles.length} Briefings
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-lg">No reports filed under {categoryName} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((post) => (
            <Link href={`/read/${post.slug}`} key={post.id} className="block">
              <article className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors h-full flex flex-col group cursor-pointer shadow-lg">
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 mb-4 line-clamp-3 flex-grow">
                  {post.content}
                </p>
                <div className="text-sm text-slate-500 font-medium group-hover:text-indigo-400 transition-colors flex items-center justify-between mt-4">
                  <span>Read Article</span>
                  <span className="text-xs uppercase bg-slate-800 px-2 py-1 rounded text-slate-300">By {post.author}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
