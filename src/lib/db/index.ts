import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

// neon-http is the right driver for serverless Route Handlers: each query is a
// one-shot HTTP request, so there is no connection pool to manage on Vercel.
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
