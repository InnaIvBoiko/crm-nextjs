/**
 * Seeds Postgres from the original mock data. Run with `npm run db:seed`.
 *
 * Rows are inserted with their original ids so the cross-references stay intact,
 * then each table's identity sequence is bumped past MAX(id) so future inserts
 * (via the API) don't collide with the seeded ids.
 *
 * Env is loaded before the db client is imported (dynamic import) because the
 * client throws on a missing DATABASE_URL at module load.
 */
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
    const { sql } = await import('drizzle-orm');
    const { db } = await import('./index');
    const schema = await import('./schema');
    const mock = await import('../mock-data');

    console.log('Clearing existing rows...');
    // Delete children first; FKs also cascade, but being explicit is clearer.
    await db.delete(schema.summarySales);
    await db.delete(schema.promotions);
    await db.delete(schema.companies);
    await db.delete(schema.categories);
    await db.delete(schema.countries);

    console.log('Inserting countries and categories...');
    await db.insert(schema.countries).values(
        mock.countries.map((c) => ({ id: Number(c.id), title: c.title })),
    );
    await db.insert(schema.categories).values(
        mock.categories.map((c) => ({ id: Number(c.id), title: c.title })),
    );

    console.log('Inserting companies...');
    await db.insert(schema.companies).values(
        mock.companies.map((c) => ({
            id: Number(c.id),
            title: c.title,
            description: c.description,
            status: c.status,
            joinedDate: c.joinedDate,
            categoryId: Number(c.categoryId),
            countryId: Number(c.countryId),
            avatar: c.avatar ?? null,
        })),
    );

    console.log('Inserting promotions and sales...');
    await db.insert(schema.promotions).values(
        mock.promotions.map((p) => ({
            id: Number(p.id),
            title: p.title,
            description: p.description,
            discount: p.discount,
            companyId: Number(p.companyId),
            avatar: p.avatar ?? null,
        })),
    );
    await db.insert(schema.summarySales).values(
        mock.summarySales.map((s) => ({
            id: Number(s.id),
            companyId: Number(s.companyId),
            sold: s.sold,
            income: s.income,
        })),
    );

    console.log('Resetting identity sequences...');
    for (const table of [
        'countries',
        'categories',
        'companies',
        'promotions',
        'summary_sales',
    ]) {
        await db.execute(
            sql`select setval(pg_get_serial_sequence(${table}, 'id'), (select max(id) from ${sql.identifier(table)}))`,
        );
    }

    console.log('Seed complete.');
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
