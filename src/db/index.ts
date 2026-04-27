import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This securely connects to Neon using the URL in your .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
