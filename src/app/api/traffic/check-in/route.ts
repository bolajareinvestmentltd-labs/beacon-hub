import { NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { siteTraffic } from '@/db/schema';
import { runDbOperation } from '@/lib/db-utils';

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const visitorId = typeof payload.visitorId === 'string' ? payload.visitorId.trim() : '';
    const path = typeof payload.path === 'string' ? payload.path.slice(0, 500) : '/';

    if (!/^[0-9a-f-]{36}$/i.test(visitorId)) {
      return NextResponse.json({ error: 'Invalid visitor identifier.' }, { status: 400 });
    }

    const visitDate = new Date().toISOString().slice(0, 10);
    await runDbOperation(() =>
      db.insert(siteTraffic)
        .values({ visitorId, visitDate, visits: 1, firstPath: path })
        .onConflictDoUpdate({
          target: [siteTraffic.visitorId, siteTraffic.visitDate],
          set: { visits: sql`${siteTraffic.visits} + 1` },
        })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Traffic check-in failed:', error);
    return new NextResponse(null, { status: 204 });
  }
}