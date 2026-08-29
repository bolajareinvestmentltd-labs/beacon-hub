import Link from 'next/link';
import { getArticlesByCategory } from '@/lib/queries';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const rawCategory = resolvedParams.category;
  const formattedCategory = decodeURIComponent(rawCategory)
    .replace(/-/g, ' ')
    .toUpperCase();

  const articles = await getArticlesByCategory(rawCategory);

  return (
    // Note the heavy pt-36 padding here to clear the fixed navbar height cleanly!
    <main className="min-h-screen bg-background px-6 pt-36 pb-16 text-foreground">
      <div className="mx-auto mb-12 max-w-6xl border-b border-border pb-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
          LIVE INTELLIGENCE SECTOR // {rawCategory.toUpperCase()}
        </span>
        <h1 className="mt-2 text-4xl font-serif font-black tracking-tight text-foreground md:text-6xl">
          {formattedCategory}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {articles.length === 0 ? (
          <div className="rounded-sm border-2 border-dashed border-border p-12 text-center bg-muted/60">
            <h3 className="text-lg font-serif font-bold uppercase text-foreground">No Live Feed Available</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              No published articles have been assigned to this sector yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link
                href={`/read/${article.slug}`}
                key={article.id || index}
                className="group block rounded-sm border border-border/80 bg-card/55 p-6 transition-all duration-300 hover:border-accent/60 hover:bg-card/80"
              >
                {article.coverImage && (
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 mb-4 rounded-sm"
                  />
                )}
                <span className="mb-2 block text-xs font-mono font-bold text-accent">
                  {article.category}
                </span>
                <h3 className="line-clamp-2 text-lg font-serif font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
