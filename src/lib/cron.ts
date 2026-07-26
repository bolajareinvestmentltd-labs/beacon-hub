export function isAuthorizedCronRequest(req: Request, options?: { allowVercelCron?: boolean }) {
  const expectedSecret = process.env.CRON_SECRET?.trim();
  const allowVercelCron = options?.allowVercelCron ?? true;

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
