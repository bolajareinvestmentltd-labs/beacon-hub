import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';

// Only load dotenv in Node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  dotenv.config({ path: '.env.local' });
}

// This securely connects to Neon using the URL in your .env.local
const sql = neon(process.env.DATABASE_URL!);

// Creates the Drizzle ORM instance
export const db = drizzle(sql);