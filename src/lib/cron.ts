// Shared cron authorization helper for Vercel cron and external schedulers like cron-job.org.
export function isAuthorizedCronRequest(req: Request, options?: { allowVercelCron?: boolean }) {
  const expectedSecret = process.env.CRON_SECRET?.trim();
  // For security, do NOT implicitly trust the Vercel cron header by default.
  // Callers may opt-in by passing { allowVercelCron: true } when running inside
  // a trusted Vercel environment that guarantees the header authenticity.
  const allowVercelCron = options?.allowVercelCron ?? false;

  const authHeader = req.headers.get('authorization')?.trim();
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const headerSecret = req.headers.get('x-cron-secret')?.trim();
  const querySecret = new URL(req.url).searchParams.get('secret')?.trim();
  const apiKey = req.headers.get('x-api-key')?.trim();
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';

  if (allowVercelCron && isVercelCron) {
    return true;
  }

  if (!expectedSecret) {
    return false;
  }

  return [bearerSecret, headerSecret, querySecret, apiKey].includes(expectedSecret);
}
