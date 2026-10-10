import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';

// Only load dotenv in Node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  dotenv.config({ path: '.env.local' });
}

const databaseUrl = process.env.DATABASE_URL?.trim();

const unavailableDatabase = new Proxy({} as ReturnType<typeof drizzle>, {
  get() {
    throw new Error('DATABASE_URL is required for database-backed Beacon Hub features.');
  },
});

export const db = databaseUrl ? drizzle(neon(databaseUrl)) : unavailableDatabase;