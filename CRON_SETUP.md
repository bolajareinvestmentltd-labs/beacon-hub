# News Cron Setup

The news endpoint is `GET /api/cron/news`. It imports current articles from GNews when `GNEWS_API_KEY` is configured and falls back to `GEMINI_API_KEY` with `GEMINI_MODEL` (default: `gemini-2.0-flash`) when GNews is unavailable or returns no articles. Incoming stories are classified into `Global News`, `Tech & Startups`, or `Elections 2027`, deduplicated by slug, and saved to the `articles` table.

## Automatic execution

The schedule is declared in `vercel.json` as `0 0 * * *`, which means once daily at 00:00 UTC. Vercel runs it automatically only after the project is deployed to production. Preview deployments do not run production cron schedules.

Configure these production environment variables before deploying:

- `DATABASE_URL`
- `CRON_SECRET`
- `GNEWS_API_KEY` (recommended for current news)
- `GEMINI_API_KEY` (required for the fallback generator)
- `GEMINI_MODEL` (optional)

The route accepts Vercel's authenticated cron header in production. External schedulers must send `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>`.

## Manual test

After deployment, trigger a sync with:

```powershell
Invoke-WebRequest -Method Get -Uri "https://www.beacon-hub.com.ng/api/cron/news" -Headers @{ Authorization = "Bearer $env:CRON_SECRET" }
```

The response reports the source, inserted count, and skipped duplicate count. A successful request with `inserted: 0` usually means the fetched stories already exist or the upstream provider returned no usable articles.

## Gemini and image previews

Gemini-generated articles may return no image because the model cannot guarantee a real image URL; the article page's social metadata then uses the Beacon Hub logo fallback. For reliable WhatsApp previews, manually created or imported articles should use a public HTTPS JPEG or PNG cover image kept under 300 KB.

The PWA manifest is available at `/manifest.webmanifest`. A service worker package such as `@serwist/next` can be added later for offline caching; the manifest and install metadata do not require a service worker to make the site installable.