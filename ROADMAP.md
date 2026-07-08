# Beacon Hub repair roadmap

## Goal
Restore homepage data loading, fix the automated news sync, and make social sharing previews show the app logo.

## Scope for this pass
1. Fix the SQL ordering syntax in the shared article query helpers.
2. Harden the cron news sync so it survives Gemini/API failures and writes articles through the shared persistence layer.
3. Add a manual admin endpoint for triggering article imports.
4. Fix metadata and Open Graph/Twitter image configuration for social previews.
5. Repair Vercel deployment configuration so new commits trigger builds again.

## Minimal implementation plan
- Patch the article query helpers to use a stable `ORDER BY published_at DESC` expression.
- Replace the brittle inline cron SQL insert loop with shared persistence logic that skips duplicates.
- Add an authenticated admin route for manual imports.
- Point metadata images to the existing public logo file and use a full absolute URL for social sharing.
- Validate the Vercel config and keep the cron schedule minimal.

## Verification checklist
- Build the app locally with `npm run build`.
- Call the cron route with the configured secret header.
- Call the admin import route with a valid bearer token and JSON payload.
- Confirm the homepage renders articles after the fix.
