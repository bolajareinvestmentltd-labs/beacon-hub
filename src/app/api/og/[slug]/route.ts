import { getArticleBySlug } from '@/lib/queries';
import { normalizeArticleSlug } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

// WhatsApp silently drops previews whose image is over ~300 KB or slow to load.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 6000;

function fallbackRedirect(request: Request) {
  return Response.redirect(new URL('/beacon-hub-lockup.png', request.url), 302);
}

/**
 * Same-origin, crawler-friendly share image for an article.
 * The cover image is fetched server-side (many news CDNs block hotlinking or
 * serve odd content-types) and re-served over our own https domain.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(normalizeArticleSlug(slug) || slug);
    const cover = article?.coverImage ? String(article.coverImage) : '';
    if (!cover) return fallbackRedirect(request);

    const source = new URL(cover, request.url);
    if (source.protocol !== 'https:' && source.protocol !== 'http:') return fallbackRedirect(request);

    const upstream = await fetch(source, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BeaconHubBot/1.0)', Accept: 'image/jpeg,image/png,image/*;q=0.8' },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || '';
    if (!upstream.ok || !contentType.startsWith('image/') || contentType === 'image/svg+xml') {
      return fallbackRedirect(request);
    }

    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return fallbackRedirect(request);

    return new Response(bytes, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return fallbackRedirect(request);
  }
}

