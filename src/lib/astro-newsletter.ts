import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { Resend } from 'resend';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { createNewsletterToken } from '@/lib/newsletter-token';

type DailyReading = {
  sign: string;
  reading: string;
  lunarPhase: string;
  luckyColor: string;
  luckyNumber: number;
  tarotCard: string;
  tarotMessage: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character);
}

export async function sendDailyAstroUpdates(readings: DailyReading[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const secret = process.env.READER_SESSION_SECRET;
  if (!apiKey || !secret || secret.length < 32) {
    throw new Error('RESEND_API_KEY and a 32-character READER_SESSION_SECRET are required for astrology email.');
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredSiteUrl?.startsWith('https://') ? configuredSiteUrl : 'https://www.beacon-hub.com.ng';
  const optedIn = await db.select({ email: subscribers.email, sign: subscribers.zodiacSign })
    .from(subscribers)
    .where(and(isNull(subscribers.unsubscribedAt), eq(subscribers.horoscopeUpdates, true), isNotNull(subscribers.zodiacSign)));
  if (!optedIn.length) return { sent: 0, failed: 0 };

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || 'Beacon Hub <support@beacon-hub.com.ng>';
  let sent = 0;
  let failed = 0;

  for (let start = 0; start < optedIn.length; start += 10) {
    const results = await Promise.all(optedIn.slice(start, start + 10).map(async ({ email, sign }) => {
      try {
        const reading = readings.find((item) => item.sign.toLowerCase() === sign?.toLowerCase());
        if (!reading) return false;

        const unsubscribeUrl = new URL('/api/newsletter/unsubscribe', siteUrl);
        unsubscribeUrl.searchParams.set('token', createNewsletterToken(email, secret));
        const result = await resend.emails.send({
          from,
          to: email,
          subject: `Your ${reading.sign} horoscope and Tarot for today`,
          html: `<main style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#10252b"><p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#007f82">Beacon Hub / Astro Desk</p><h1 style="font-size:28px">${escapeHtml(reading.sign)} / Daily Reading</h1><p style="font-size:12px;color:#52696d">${escapeHtml(reading.lunarPhase)} · Lucky color: ${escapeHtml(reading.luckyColor)} · Number: ${reading.luckyNumber}</p><p style="line-height:1.7">${escapeHtml(reading.reading)}</p><section style="margin-top:24px;padding:18px;background:#e4efeb;border-left:4px solid #f05d4e"><p style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#007f82">Today's Tarot</p><h2 style="margin:4px 0">${escapeHtml(reading.tarotCard)}</h2><p style="line-height:1.6">${escapeHtml(reading.tarotMessage)}</p></section><p style="font-size:12px;color:#52696d">For reflection and entertainment. <a href="${unsubscribeUrl}">Unsubscribe from Beacon Hub emails</a>.</p></main>`,
          text: `${reading.sign} / Daily Reading\n\n${reading.reading}\n\nToday's Tarot: ${reading.tarotCard}\n${reading.tarotMessage}\n\nUnsubscribe: ${unsubscribeUrl}`,
          headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
        });
        return !result.error;
      } catch (error) {
        console.error('Daily horoscope email failed:', { email, sign, error });
        return false;
      }
    }));
    sent += results.filter(Boolean).length;
    failed += results.filter((result) => !result).length;
  }

  return { sent, failed };
}