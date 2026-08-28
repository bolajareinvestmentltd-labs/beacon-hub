import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq, ne } from 'drizzle-orm';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { verifyAdminSessionToken } from '@/lib/server-auth';

async function authorizeAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !session || !verifyAdminSessionToken(session, sessionSecret)) {
    return false;
  }

  return true;
}

function normalizeSlug(value: string | null | undefined) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 255);
}

export async function POST() {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await db
      .select({ id: articles.id, slug: articles.slug, title: articles.title })
      .from(articles)
      .where(ne(articles.slug, ''));

    const seen = new Set<string>();
    const fixes: Array<{ id: number; from: string; to: string }> = [];

    for (const row of rows) {
      const original = String(row.slug ?? '').trim();
      const normalized = normalizeSlug(original);

      if (!normalized) {
        continue;
      }

      let candidate = normalized;
      let counter = 1;
      while (seen.has(candidate)) {
        counter += 1;
        candidate = `${normalized}-${counter}`;
      }
      seen.add(candidate);

      if (candidate !== original) {
        fixes.push({ id: Number(row.id), from: original, to: candidate });
      }
    }

    for (const fix of fixes) {
      await db
        .update(articles)
        .set({ slug: fix.to })
        .where(eq(articles.id, fix.id));
    }

    return NextResponse.json({
      success: true,
      repaired: fixes.length,
      fixes: fixes.slice(0, 20),
      message: fixes.length
        ? `Repaired ${fixes.length} malformed article slugs.`
        : 'No malformed article slugs detected.',
    });
  } catch (error) {
    console.error('Slug repair failed:', error);
    return NextResponse.json(
      { error: 'Unable to repair article slugs.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
