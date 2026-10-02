import type { Metadata } from 'next';
import Image from 'next/image';

export const revalidate = 3600;

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl?.startsWith('https://')
  ? configuredSiteUrl
  : 'https://www.beacon-hub.com.ng';
const fallbackImageUrl = new URL('/logo.png', siteUrl).toString();
const curatedNewsDescription = 'Independent summaries of the latest technology and innovation reporting, with links to original sources.';

function toAbsoluteHttpsUrl(value?: string | null) {
  if (!value) return fallbackImageUrl;

  try {
    const url = new URL(value, siteUrl);
    return url.protocol === 'https:' ? url.toString() : fallbackImageUrl;
  } catch {
    return fallbackImageUrl;
  }
}

type CuratedArticle = {
  id: number;
  title: string;
  summary: string;
  cover_image?: string | null;
  canonical_url: string;
  published_at: string | null;
  source_name: string;
  source_url: string;
};

type ArticleResponse = {
  results?: CuratedArticle[];
};

async function getCuratedArticles(): Promise<CuratedArticle[]> {
  const apiBase = (process.env.DJANGO_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

  try {
    const response = await fetch(`${apiBase}/articles/?page_size=24`, {
      next: { revalidate },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as ArticleResponse;
    return Array.isArray(payload.results) ? payload.results : [];
  } catch (error) {
    console.error('Unable to load curated articles:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [latestArticle] = await getCuratedArticles();
  const title = 'Curated Tech News | Beacon Hub';
  const description = latestArticle?.summary || curatedNewsDescription;
  const imageUrl = toAbsoluteHttpsUrl(latestArticle?.cover_image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: new URL('/curated-news', siteUrl).toString(),
      siteName: 'Beacon Hub',
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: 'Beacon Hub curated technology news' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

function formatDate(value: string | null) {
  if (!value) return 'Recently published';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently published'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

export default async function CuratedNewsPage() {
  const articles = await getCuratedArticles();

  return (
    <div className="min-h-screen w-full py-6 sm:py-10">
      <header className="border-y border-border/70 py-6 sm:py-9">
        <p className="font-mono text-[10px] text-[#E2725B]">Beacon Hub / Curated Desk</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="max-w-3xl text-3xl font-black leading-tight text-foreground sm:text-5xl">
            Technology, with the signal kept clear.
          </h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Original reporting, independently summarized. Every story links to its publisher.
          </p>
        </div>
      </header>

      <section aria-label="Curated technology news" className="py-7 sm:py-10">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-bold text-foreground">Latest briefings</h2>
          <span className="font-mono text-[10px] text-muted-foreground">{articles.length} STORIES</span>
        </div>

        {articles.length === 0 ? (
          <p className="border-l-2 border-[#E2725B] py-3 pl-4 text-sm text-muted-foreground">
            No curated stories are available right now. Check back after the next feed update.
          </p>
        ) : (
          <div className="divide-y divide-border/80">
            {articles.map((article, index) => (
              <article key={article.id} className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr_12rem] sm:gap-6 sm:py-7">
                <span className="font-mono text-[10px] text-[#E2725B]">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">{article.title}</h3>
                  <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-muted sm:mt-5">
                    <Image
                      src={toAbsoluteHttpsUrl(article.cover_image)}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) calc(100vw - 3rem), 800px"
                      unoptimized
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{article.summary}</p>
                  <a
                    href={article.canonical_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-[#E2725B] underline decoration-[#E2725B]/40 underline-offset-4 hover:decoration-[#E2725B]"
                  >
                    Read original at {article.source_name}
                  </a>
                </div>
                <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground sm:flex-col sm:items-end sm:justify-start sm:text-right">
                  <a href={article.source_url} target="_blank" rel="noreferrer" className="font-semibold text-foreground hover:text-[#E2725B]">
                    {article.source_name}
                  </a>
                  <time dateTime={article.published_at || undefined}>{formatDate(article.published_at)}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}