import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { siteTraffic } from '@/db/schema';
import { verifyAdminSessionToken } from '@/lib/server-auth';
import { runDbOperation } from '@/lib/db-utils';

async function authorized() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(secret && session && verifyAdminSessionToken(session, secret));
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [todayRows, totalRows] = await Promise.all([
      runDbOperation(() => db.select({ visitors: sql<number>`count(*)`, visits: sql<number>`coalesce(sum(${siteTraffic.visits}), 0)` })
        .from(siteTraffic).where(eq(siteTraffic.visitDate, today))),
      runDbOperation(() => db.select({ visitors: sql<number>`count(distinct ${siteTraffic.visitorId})`, visits: sql<number>`coalesce(sum(${siteTraffic.visits}), 0)` }).from(siteTraffic)),
    ]);

    return NextResponse.json({
      todayVisitors: Number(todayRows[0]?.visitors || 0),
      todayVisits: Number(todayRows[0]?.visits || 0),
      totalVisitors: Number(totalRows[0]?.visitors || 0),
      totalVisits: Number(totalRows[0]?.visits || 0),
    });
  } catch (error) {
    console.error('Traffic summary failed:', error);
    return NextResponse.json({ error: 'Unable to load traffic summary.' }, { status: 500 });
  }
}