import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// 1. Parse the live production database key from your environment file
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
if (!match) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}
const url = match[1];
const sql = neon(url);

console.log("⚡ Connecting to Neon database...");
try {
  // 2. Clear out the legacy column structures completely
  await sql`ALTER TABLE articles DROP COLUMN IF EXISTS author;`;
  await sql`ALTER TABLE articles DROP COLUMN IF EXISTS is_published;`;
  await sql`ALTER TABLE articles DROP COLUMN IF EXISTS source;`;
  await sql`ALTER TABLE articles DROP COLUMN IF EXISTS is_sponsored;`;
  console.log("✅ Legacy columns successfully dropped from Neon server.");
} catch (e) {
  console.error("❌ SQL execution failed:", e.message);
}
