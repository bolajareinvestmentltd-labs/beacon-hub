import { config } from 'dotenv';
import { db } from '../src/db/index.ts';
import { admins } from '../src/db/schema.ts';
import { hashPassword } from '../src/lib/server-auth.ts';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.mjs <email> <password>');
    process.exit(1);
  }

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  const passwordHash = hashPassword(password);
  if (existing.length > 0) {
    await db.update(admins).set({ passwordHash, role: 'admin' }).where(eq(admins.email, email));
    console.log(`Admin password updated successfully for ${email}`);
    process.exit(0);
  }

  await db.insert(admins).values({ email, passwordHash, role: 'admin' });
  console.log(`Admin created successfully for ${email}`);
}

main().catch((error) => {
  console.error('Failed to create admin:', error);
  process.exit(1);
});
