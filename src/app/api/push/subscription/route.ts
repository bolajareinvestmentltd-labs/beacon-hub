import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { checkAPILimit } from '@/lib/rateLimit';
import { verifyReaderSessionToken } from '@/lib/server-auth';

const SubscriptionSchema = z.object({
  endpoint: z.string().url().max(3000),
  keys: z.object({
    p256dh: z.string().min(20).max(256),
    auth: z.string().min(10).max(128),
  }),
});

async function getReader() {
  const secret = process.env.READER_SESSION_SECRET;
  const token = (await cookies()).get('reader_session')?.value;
  return secret && secret.length >= 32 && token ? verifyReaderSessionToken(token, secret) : null;
}

export async function GET() {
  return NextResponse.json({ publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '' });
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await checkAPILimit(ip))) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  const reader = await getReader();
  if (!reader) return NextResponse.json({ error: 'Enter your email before enabling notifications.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 });
  }
  const parsed = SubscriptionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 });

  await db.insert(pushSubscriptions).values({
    endpoint: parsed.data.endpoint,
    readerId: reader.readerId,
    email: reader.email,
    p256dh: parsed.data.keys.p256dh,
    auth: parsed.data.keys.auth,
  }).onConflictDoUpdate({
    target: pushSubscriptions.endpoint,
    set: { readerId: reader.readerId, email: reader.email, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const reader = await getReader();
  if (!reader) return NextResponse.json({ error: 'Enter your email before managing notifications.' }, { status: 401 });

  let endpoint: unknown;
  try {
    endpoint = (await request.json()).endpoint;
  } catch {
    return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 });
  }
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
    return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 });
  }

  await db.delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.readerId, reader.readerId)));
  return NextResponse.json({ success: true });
}