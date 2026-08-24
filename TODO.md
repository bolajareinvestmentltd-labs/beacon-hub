# TODO

## Immediate Product Work

- [ ] Verify custom-domain DNS, SSL, Vercel project assignment, and billing status.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the canonical custom domain in Vercel Production.
- [ ] Rotate credentials previously exposed in `.env.example` and replace examples with placeholders.
- [ ] Verify the custom domain in Resend and publish SPF, DKIM, and DMARC records.
- [ ] Configure `RESEND_FROM_EMAIL` and `RESEND_ADMIN_EMAIL` for production delivery.
- [ ] Verify contact form delivery from browser through Resend.
- [ ] Verify Google AdSense publisher ID, real ad slots, `ads.txt`, consent, and policy pages.
- [x] Add the daily signal clock using the Africa/Lagos timezone.
- [x] Refine home-page hierarchy without changing queries, routes, or data flows.
- [x] Align dark/light theme defaults, tokens, gradients, and contrast.
- [ ] Add a short branded splash treatment for native app startup and first-session identity.
- [ ] Add native share, saved stories, reading history, and push-notification foundations.
- [ ] Prepare Play Store and App Store metadata, screenshots, privacy URL, and support URL.

## Reliability And Quality

- [ ] Run local checks: `npm install`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- [ ] Test local home, article, contact, horoscope, manifest, sitemap, and protected cron routes.
- [ ] Test deployed custom-domain routes against the Vercel deployment.
- [ ] Resolve remaining legacy lint errors without changing backend behavior.
- [ ] Replace deprecated Next.js middleware naming when supported by the deployment target.

## Completed

- [x] Generate Capacitor Android and iOS projects.
- [x] Add Capacitor setup documentation and native wrapper scripts.
- [x] Add dynamic article Open Graph and Twitter metadata.
- [x] Add PWA manifest and install prompt.
- [x] Add cron authentication, schedules, and setup documentation.

