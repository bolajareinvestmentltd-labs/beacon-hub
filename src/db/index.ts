import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Force load environment variables before Next.js or scripts try to connect
dotenv.config({ path: '.env.local' });

// This securely connects to Neon using the URL in your .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });