import {
    date,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
} from 'drizzle-orm/pg-core';

/**
 * Database schema for the CRM. The API responses (`src/lib/api.ts`) are
 * denormalized — companies carry their country/category titles and a
 * `hasPromotions` flag — but those are derived from joins at query time, so the
 * tables themselves stay normalized: companies reference countries/categories
 * by id, and promotions/sales reference companies by id.
 */

// Mirrors the `CompanyStatus` enum in `src/lib/api.ts`.
export const companyStatus = pgEnum('company_status', [
    'active',
    'notActive',
    'pending',
    'suspended',
]);

export const countries = pgTable('countries', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
});

export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: companyStatus('status').notNull(),
    joinedDate: date('joined_date', { mode: 'string' }).notNull(),
    categoryId: integer('category_id')
        .notNull()
        .references(() => categories.id),
    countryId: integer('country_id')
        .notNull()
        .references(() => countries.id),
    avatar: text('avatar'),
});

export const promotions = pgTable('promotions', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    discount: integer('discount').notNull(),
    companyId: integer('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    avatar: text('avatar'),
});

export const summarySales = pgTable('summary_sales', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    sold: integer('sold').notNull(),
    income: integer('income').notNull(),
});
