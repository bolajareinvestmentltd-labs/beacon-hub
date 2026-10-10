import webPush from 'web-push';
import { desc, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { articles, pushSubscriptions } from '@/db/schema';

export async function sendNewsPush(slugs: string[]) {
  if (!slugs.length) return { sent: 0, failed: 0 };

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return { sent: 0, failed: 0, skipped: true };

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredSiteUrl?.startsWith('https://') ? configuredSiteUrl : 'https://www.beacon-hub.com.ng';
  const latest = await db.select({ slug: articles.slug, title: articles.title, excerpt: articles.excerpt, coverImage: articles.coverImage })
    .from(articles)
    .where(inArray(articles.slug, slugs))
    .orderBy(desc(articles.publishedAt))
    .limit(1);
  const story = latest[0];
  if (!story) return { sent: 0, failed: 0 };

  const subscriptions = await db.select().from(pushSubscriptions);
  if (!subscriptions.length) return { sent: 0, failed: 0 };

  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@beacon-hub.com.ng',
    publicKey,
    privateKey,
  );
  const payload = JSON.stringify({
    title: story.title,
    body: `${story.excerpt} · ${slugs.length} new ${slugs.length === 1 ? 'story' : 'stories'}`,
    image: story.coverImage?.startsWith('https://') ? story.coverImage : new URL('/logo-512.png', siteUrl).toString(),
    url: new URL(`/read/${encodeURIComponent(story.slug)}`, siteUrl).toString(),
    tag: `beacon-hub-${story.slug}`,
  });
  let sent = 0;
  let failed = 0;

  for (let start = 0; start < subscriptions.length; start += 20) {
    const results = await Promise.all(subscriptions.slice(start, start + 20).map(async (subscription) => {
      try {
        await webPush.sendNotification({
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        }, payload, { TTL: 60 * 60 });
        return true;
      } catch (error) {
        const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
          ? Number((error as { statusCode: unknown }).statusCode)
          : undefined;
        if (statusCode === 404 || statusCode === 410) {
          await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.endpoint, [subscription.endpoint]));
        }
        console.error('News push delivery failed:', { statusCode, error });
        return false;
      }
    }));
    sent += results.filter(Boolean).length;
    failed += results.filter((result) => !result).length;
  }

  return { sent, failed };
}