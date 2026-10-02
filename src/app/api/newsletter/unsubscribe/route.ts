import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { verifyNewsletterToken } from '@/lib/newsletter-token';

function htmlPage(title: string, content: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Beacon Hub</title><body style="margin:0;background:#f2f7f3;color:#10252b;font:16px/1.6 Arial,sans-serif"><main style="max-width:560px;margin:12vh auto;padding:32px;background:#fbfefc;border:1px solid #c8d8d2"><p style="color:#007f82;font-size:12px;font-weight:700;letter-spacing:2px">BEACON HUB</p><h1>${title}</h1>${content}</main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

function resolveEmail(token: string | null) {
  const secret = process.env.READER_SESSION_SECRET;
  return token && secret && secret.length >= 32 ? verifyNewsletterToken(token, secret) : null;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!resolveEmail(token)) {
    return htmlPage('Link unavailable', '<p>This unsubscribe link is invalid or has expired.</p>', 400);
  }

  return htmlPage(
    'Unsubscribe from updates',
    `<p>Confirm that you no longer want Beacon Hub email briefings.</p><form method="post"><input type="hidden" name="token" value="${token}"><button style="padding:12px 18px;border:0;background:#007f82;color:white;font-weight:700;cursor:pointer">Unsubscribe</button></form>`,
  );
}

export async function POST(request: Request) {
  const queryToken = new URL(request.url).searchParams.get('token');
  let formToken: string | null = null;
  try {
    formToken = String((await request.formData()).get('token') || '') || null;
  } catch {
    // RFC 8058 one-click requests carry the signed token in the URL.
  }

  const email = resolveEmail(queryToken || formToken);
  if (!email) return htmlPage('Link unavailable', '<p>This unsubscribe link is invalid or has expired.</p>', 400);

  await db.update(subscribers)
    .set({ unsubscribedAt: new Date() })
    .where(eq(subscribers.email, email));
  return htmlPage('You are unsubscribed', '<p>You will no longer receive Beacon Hub news briefings.</p>');
}