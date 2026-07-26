# Deployment & Vercel Troubleshooting

This document lists the environment variables and common fixes required to deploy the Beacon Hub app successfully on Vercel.

## Required Environment Variables
Add these to your Vercel project (Project → Settings → Environment Variables) for both `Preview` and `Production` as appropriate.

- `DATABASE_URL` — Neon/Postgres connection string used by Drizzle.
- `ADMIN_SESSION_SECRET` — HMAC secret for admin session cookies.
- `CRON_SECRET` — Bearer secret for cron endpoints (fallback when not Vercel cron).
- `GEMINI_API_KEY` — API key used by Gemini cron ingestion.
- `RESEND_API_KEY` — (if using Resend) API key for email sending.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — for rate-limiting and caching (if used).
- `NEXT_PUBLIC_ADSENSE_PUB_ID` — AdSense publisher id for ad rendering (optional but recommended for production).
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (optional, used for metadata).

## External cron-job.org setup

You can trigger the same cron endpoints from cron-job.org without relying on Vercel cron.

- News endpoint: https://www.beacon-hub.com.ng/api/cron/news
- Horoscope endpoint: https://www.beacon-hub.com.ng/api/cron/astro
- Method: GET
- Header: Authorization = Bearer YOUR_CRON_SECRET

Recommended schedule:
- News: 08:00 and 20:00 UTC
- Horoscope: 07:30 UTC daily

If you use cron-job.org, add `CRON_SECRET` in Vercel as a production environment variable so the request is authorized.

## Common Deployment Issues & Fixes

- Missing envs causing build or runtime errors
  - Symptom: Build fails with errors referencing `DATABASE_URL`, `GEMINI_API_KEY`, or similar.
  - Fix: Add missing envs to the Vercel project and re-deploy (or redeploy with "Clear cache").

- Wrong production branch / stale build
  - Symptom: Vercel is deploying an old commit.
  - Fix: In Vercel Project → Git, confirm `Production Branch` is `main`. Use the Deployments page to pick the correct commit or trigger a redeploy.

- Edge vs Node APIs (crypto import errors)
  - Symptom: Build errors mentioning Node `crypto` in middleware/edge runtime.
  - Fix: Ensure Node-only modules (using `crypto`) are only imported by server-only files. Use `src/lib/edge-auth.ts` (Web Crypto) in `middleware` and server-only `src/lib/server-auth.ts` for Node crypto.

- Cache or build corruption
  - Symptom: Deploy previously worked locally but fails on Vercel.
  - Fix: Redeploy with the "Clear cache" option from the Vercel UI or push an empty commit to trigger a clean build.

## How to Inspect Vercel Logs

1. Open the Vercel dashboard for the project.
2. Click `Deployments` and open the failed deployment.
3. Click `View Logs` and copy the console output around the red error lines.

Paste the failing log lines here and I will diagnose and provide a specific patch.

## Quick Local Reproduction

To reproduce build problems locally, set the same environment variables before running the build. Example (PowerShell):

```powershell
$env:DATABASE_URL = "postgresql://..."
$env:ADMIN_SESSION_SECRET = "replace_with_secret"
$env:GEMINI_API_KEY = "replace_with_key"
npm run build
```

Replace values with your secrets. Running the build locally with the same envs will usually reproduce Vercel build failures.

## Next Steps I Can Do

- Inspect Vercel logs if you paste them here.
- Add a small CI check or GitHub Action that runs `npm run build` with mocked envs to catch regressions.
- Remove the compatibility re-export in `src/lib/auth.ts` and update imports to `server-auth` directly (cleaner change).

### Workaround for Vercel Hobby Cron Limits

Vercel Hobby plans only allow cron jobs that run once per day. If you need higher-frequency scheduling (every 2 hours, every 30 minutes, etc.) without upgrading the Vercel plan, use a GitHub Actions scheduled workflow to call your cron endpoints instead of relying on `vercel.json`.

1. I updated `vercel.json` to ensure the `news` cron is once-per-day so deployments succeed.
2. A GitHub Actions workflow is included at `.github/workflows/cron-news.yml` to call `/api/cron/news` every 2 hours. To use it:
  - Add a repository secret named `CRON_SECRET` with the same value as your Vercel `CRON_SECRET` environment variable.
  - Optionally add `NEXT_PUBLIC_SITE_URL` as a secret for the workflow to use your custom domain.

This approach bypasses Vercel's scheduling limits while keeping deployment healthy.

