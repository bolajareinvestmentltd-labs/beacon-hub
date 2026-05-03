import { getArticlesByCategory } from "../../../lib/queries";
import Link from "next/link";
import SubNavigation from "@/components/SubNavigation";

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name);
  const articles = await getArticlesByCategory(categoryName);

  return (
    <>
      <SubNavigation />
      
      <div className="max-w-4xl mx-auto py-12 px-4 pb-32">
        <header className="mb-12 border-b-2 border-[#0A1128] pb-6">
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-[#0A1128] mb-4">
            {categoryName} Desk
          </h1>
          <p className="text-slate-500 font-medium">
            The latest updates and briefings from the {categoryName} sector.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-[#0A1128] mb-2">No Reports Filed</h2>
            <p className="text-slate-500">Check back shortly for breaking updates.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-200">
            {articles.map((article) => (
              <Link href={`/read/${article.slug}`} key={article.id} className="py-8 group flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                   {new Date(article.createdAt ?? new Date()).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="font-playfair text-3xl font-bold text-[#0A1128] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-slate-600 line-clamp-3 text-base mt-2 leading-relaxed">
                  {article.content}
                </p>
                <div className="text-sm font-semibold text-[#0A1128] mt-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0A1128] text-[#FAFAFA] flex items-center justify-center text-[10px]">
                    {article.author?.charAt(0) || "P"}
                  </span>
                  {article.author}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
