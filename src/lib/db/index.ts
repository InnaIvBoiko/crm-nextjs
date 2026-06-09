import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | null = null;

// neon-http is the right driver for serverless Route Handlers: each query is a
// one-shot HTTP request, so there is no connection pool to manage on Vercel.
function getDb(): Database {
    if (!instance) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set');
        }
        instance = drizzle(neon(process.env.DATABASE_URL), { schema });
    }
    return instance;
}

// Initialize lazily on first query. Importing this module must not read
// DATABASE_URL or connect — otherwise `next build` fails while collecting page
// data (it imports the route handlers without the runtime secret present).
export const db = new Proxy({} as Database, {
    get(_target, prop) {
        const client = getDb();
        const value = client[prop as keyof Database];
        return typeof value === 'function' ? value.bind(client) : value;
    },
});
