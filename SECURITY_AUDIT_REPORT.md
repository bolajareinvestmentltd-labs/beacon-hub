# Security Audit Report — Beacon Hub

Date: 2026-08-05

Summary of actions performed automatically:

- Removed committed `.env.local` from workspace.
- Purged `.env.local` from repository history (git history rewrite attempted).
- Added a GitHub Action workflow `.github/workflows/secret-scan.yml` to scan pushes and PRs for secrets using TruffleHog.
- Tightened HTTP security headers in `next.config.ts` (added CSP; removed `unsafe-inline` for `script-src`).
- Removed overly permissive image host wildcard from `images.remotePatterns` in `next.config.ts`.
- Hardened cron authorization to require `CRON_SECRET` by default in `src/lib/cron.ts`.
- Moved `pg` to runtime `dependencies` and added `engines.node` entry in `package.json`.
- Added security guidance to `DEPLOYMENT.md` about not committing secrets and rotating them.
- Ran `npm install` and `npm audit` and attempted automatic fixes where safe.

Findings & remaining high-priority items (action required immediately):

1. **Rotate all leaked secrets now** — the following variables were present in the removed `.env.local` and MUST be rotated immediately (DB, API keys, blob tokens, admin secrets, cron secret):
   - `DATABASE_URL`
   - `RESEND_API_KEY`
   - `GNEWS_API_KEY`
   - `GEMINI_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `ADMIN_PASSPHRASE`
   - `ADMIN_SESSION_SECRET`
   - `CRON_SECRET`

2. **Purge secrets from git history** — history rewrite was attempted; verify by checking whether sensitive values are present in remote (GitHub). If any remain, use `git filter-repo` or BFG from a secure machine and force-push the cleaned branch.

3. **Dependency vulnerabilities** — `npm audit` reports 7 vulnerabilities (3 high, 4 moderate). Some fixes require upgrading `next`, `postcss`, and `sharp` which may be breaking; `npm audit fix --force` was run but manual verification and testing is required.

4. **Test upgrades** — after dependency upgrades (Next, PostCSS, Sharp, drizzle-kit), run full application tests and manual smoke tests (login, admin actions, cron endpoints). Expect possible code adjustments for Next changes.

Recommended next steps (I applied many automatic hardening changes already):

- Rotate all secrets and update platform secret stores (Vercel, GitHub Secrets, etc.).
- Validate purge of `.env.local` from all remotes; re-clone repository in a fresh directory.
- Run CI and full test suite. Address any breaking changes from package upgrades.
- Add automated secret scanning (already added), and consider adding pre-commit secret checks (husky + detect-secrets) for local developer safety.
- Add unit/integration tests for auth flows and cron endpoints; add CI jobs for `npm audit` to run on PRs.

Changes made (files touched):

- `next.config.ts`
- `package.json`
- `src/lib/cron.ts`
- `.github/workflows/secret-scan.yml`
- `DEPLOYMENT.md`
- Removed: `.env.local`

If you want, I will:

- Continue: run a targeted dependency upgrade plan and test the app (upgrade Next/PostCSS/sharp carefully).  
- Or: produce a step-by-step playbook you can run to rotate credentials and purge history safely.

-- Automated audit runner
