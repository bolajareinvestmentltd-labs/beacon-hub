import Link from "next/link";
import { getArticlesByCategory } from "@/lib/queries";

export const dynamic = 'force-dynamic';

// Helper function for time
const timeAgo = (date: Date) => {
  const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  return `Updated ${Math.floor(hours / 24)} days ago`;
};

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  // Await the params
  const resolvedParams = await params;
  const categorySlug = resolvedParams.name;
  
  // Fetch live category data
  const feedArticles = await getArticlesByCategory(categorySlug);
  
  // Format the slug into a readable title (e.g., "tech-startups" -> "Tech Startups")
  const pageTitle = categorySlug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="w-full max-w-3xl mx-auto py-6 md:py-10">
      
      {/* Category Header */}
      <div className="mb-8 border-b-2 border-black dark:border-white/20 pb-4">
        <h1 className="text-3xl md:text-4xl font-black font-playfair tracking-tight text-black dark:text-[#F9F6F0]">
          {pageTitle}
        </h1>
      </div>

      {feedArticles.length === 0 ? (
        <p className="text-slate-500 italic py-10 text-center">No intelligence briefings available for this sector yet.</p>
      ) : (
        <div className="flex flex-col">
          {feedArticles.map((article) => (
            <article key={article.id} className="py-6 border-b border-black/10 dark:border-white/10 flex gap-4 md:gap-8 group">
              <div className="flex-1 flex flex-col justify-between">
                <Link href={`/read/${article.slug}`}>
                  <h2 className="text-[1.35rem] md:text-2xl font-bold font-playfair leading-tight text-black dark:text-[#F9F6F0] group-hover:text-[#E2725B] transition-colors">
                    {article.title}
                  </h2>
                </Link>
                <div className="flex items-center gap-2 mt-4 text-[11px] font-bold tracking-wide">
                  <span className="text-[#3A7B7A] dark:text-[#4A9B9A] uppercase">{article.category}</span>
                  <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                  <span className="text-slate-500">{timeAgo(article.publishedAt)}</span>
                </div>
              </div>
              <Link href={`/read/${article.slug}`} className="block flex-shrink-0">
                <div className="w-[100px] h-[75px] md:w-[160px] md:h-[100px] bg-slate-200 dark:bg-white/5 rounded-md overflow-hidden relative border border-black/5 dark:border-white/5">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"></div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}