import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is missing. Add it to .env.local or your environment before running this fix.');
  process.exit(1);
}

const sql = neon(databaseUrl);

function normalizeSlug(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 255);
}

async function main() {
  const rows = await sql`SELECT id, slug, title FROM articles WHERE slug IS NOT NULL;`;

  const seen = new Map();
  const updates = [];

  for (const row of rows) {
    const original = String(row.slug ?? '').trim();
    const normalized = normalizeSlug(original);

    if (!normalized) {
      continue;
    }

    let finalSlug = normalized;
    let counter = 1;
    while (seen.has(finalSlug)) {
      counter += 1;
      finalSlug = `${normalized}-${counter}`;
    }
    seen.set(finalSlug, true);

    if (finalSlug !== original) {
      updates.push({ id: Number(row.id), slug: finalSlug, original });
    }
  }

  if (!updates.length) {
    console.log('No malformed slugs detected. Nothing to fix.');
    return;
  }

  console.log(`Found ${updates.length} malformed slugs to repair.`);

  for (const update of updates) {
    await sql`UPDATE articles SET slug = ${update.slug} WHERE id = ${update.id};`;
    console.log(`Fixed ${update.original} -> ${update.slug}`);
  }

  console.log('Article slug repair complete.');
}

main().catch((error) => {
  console.error('Slug repair failed:', error);
  process.exit(1);
});
