# Beacon Hub

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Newsroom automation and reader features

Configure `DATABASE_URL`, `GNEWS_API_KEY`, `GEMINI_API_KEY`, and `RESEND_API_KEY` in `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS site URL and `READER_SESSION_SECRET` to a cryptographically random value of at least 32 characters. In production, also configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for reader rate limiting. Reader participation asks for an email but does not verify it; it is a contact label, not proof of identity or newsletter consent. `RESEND_FROM_EMAIL` should be a sender address verified with Resend. The daily `/api/cron/news` job queries each newsroom category, saves new stories, emails opted-in subscribers, and sends Web Push alerts to devices that enabled them.

For Web Push, run `npm install` to install `web-push` and refresh `package-lock.json`, generate VAPID keys using `npx web-push generate-vapid-keys`, and configure `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` in the deployment environment. Push requires HTTPS and explicit permission. The browser/Android OS controls the exact system notification layout; Beacon Hub supplies the headline, excerpt, cover image, and story link. The rich system notification flow targets supported browsers and installed PWAs; the Capacitor Android shell needs Firebase/Capacitor push credentials to receive native FCM notifications.

Astrology subscribers choose a zodiac sign and receive that sign's daily horoscope and Tarot reflection. The news and astrology mailing preferences are separate; the signed unsubscribe link stops all Beacon Hub email for that address.

Apply the database migrations before deploying these features:

```bash
npx drizzle-kit migrate
```

The existing website admin is unchanged: sign in at `/login`, then manage content at `/admin`. The standalone Django backend has its own admin at `http://localhost:8000/admin/`; create its staff login from `backend/` with `python manage.py createsuperuser`. Django's admin is for the RSS `Sources` and curated `Articles`; it does not replace the Next.js publishing dashboard.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
