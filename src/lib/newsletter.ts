import { inArray, isNull } from 'drizzle-orm';
import { Resend } from 'resend';
import { db } from '@/db';
import { articles, subscribers } from '@/db/schema';
import { createNewsletterToken } from '@/lib/newsletter-token';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] || character);
}

export async function sendNewsDigest(slugs: string[]) {
  if (!slugs.length) return { sent: 0, failed: 0 };

  const apiKey = process.env.RESEND_API_KEY;
  const unsubscribeSecret = process.env.READER_SESSION_SECRET;
  if (!apiKey || !unsubscribeSecret || unsubscribeSecret.length < 32) {
    throw new Error('RESEND_API_KEY and READER_SESSION_SECRET are required to send the daily digest.');
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredSiteUrl?.startsWith('https://')
    ? configuredSiteUrl
    : 'https://www.beacon-hub.com.ng';
  const stories = await db.select({ slug: articles.slug, title: articles.title, excerpt: articles.excerpt, category: articles.category })
    .from(articles)
    .where(inArray(articles.slug, slugs));
  const storyOrder = new Map(slugs.map((slug, index) => [slug, index]));
  stories.sort((left, right) => (storyOrder.get(left.slug) ?? 0) - (storyOrder.get(right.slug) ?? 0));
  const activeSubscribers = await db.select({ email: subscribers.email })
    .from(subscribers)
    .where(isNull(subscribers.unsubscribedAt));

  if (!stories.length || !activeSubscribers.length) return { sent: 0, failed: 0 };

  const resend = new Resend(apiKey);
  const storyHtml = stories.slice(0, 12).map((story) => {
    const url = new URL(`/read/${encodeURIComponent(story.slug)}`, siteUrl).toString();
    return `<li style="margin:0 0 20px"><p style="margin:0 0 5px;color:#007f82;font-size:12px;text-transform:uppercase">${escapeHtml(story.category)}</p><a href="${url}" style="color:#10252b;font-size:18px;font-weight:700;text-decoration:none">${escapeHtml(story.title)}</a><p style="color:#52696d;line-height:1.6">${escapeHtml(story.excerpt)}</p></li>`;
  }).join('');
  const storyText = stories.slice(0, 12).map((story) =>
    `${story.category}\n${story.title}\n${story.excerpt}\n${new URL(`/read/${encodeURIComponent(story.slug)}`, siteUrl)}`
  ).join('\n\n');
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'Beacon Hub <support@beacon-hub.com.ng>';
  let sent = 0;
  let failed = 0;

  for (let start = 0; start < activeSubscribers.length; start += 10) {
    const batch = activeSubscribers.slice(start, start + 10);
    const results = await Promise.all(batch.map(async ({ email }) => {
      try {
        const token = createNewsletterToken(email, unsubscribeSecret);
        const unsubscribeUrl = new URL('/api/newsletter/unsubscribe', siteUrl);
        unsubscribeUrl.searchParams.set('token', token);
        const result = await resend.emails.send({
          from: resendFrom,
          to: email,
          subject: `Beacon Hub Daily Briefing: ${stories.length} new ${stories.length === 1 ? 'story' : 'stories'}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;color:#10252b"><p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#007f82">Beacon Hub / Daily Briefing</p><h1 style="font-size:28px">Today’s news, clearly summarized.</h1><ul style="padding-left:20px">${storyHtml}</ul><p style="border-top:1px solid #c8d8d2;padding-top:16px;font-size:12px;color:#52696d">You receive this because you subscribed to Beacon Hub news updates. <a href="${unsubscribeUrl}" style="color:#007f82">Unsubscribe</a>.</p></div>`,
          text: `Beacon Hub Daily Briefing\n\n${storyText}\n\nUnsubscribe: ${unsubscribeUrl}`,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });
        return !result.error;
      } catch (error) {
        console.error('Could not send subscriber digest:', { email, error });
        return false;
      }
    }));

    sent += results.filter(Boolean).length;
    failed += results.filter((result) => !result).length;
  }

  return { sent, failed };
}