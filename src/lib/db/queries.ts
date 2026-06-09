import { eq, sql } from 'drizzle-orm';
import { db } from './index';
import {
    categories,
    companies,
    companyStatus,
    countries,
    promotions,
    summarySales,
} from './schema';
import {
    type Category,
    type Company,
    type CompanyStatus,
    type Country,
    type Promotion,
    type SummarySales,
    type SummaryStats,
} from '../api';

/**
 * Data-access layer. Each function returns the exact denormalized shapes the
 * API contract (`src/lib/api.ts`) expects — ids as strings, titles resolved via
 * joins, and `hasPromotions` derived — so the Route Handlers stay thin and the
 * frontend is unaffected by the move from in-memory data to Postgres.
 */

type StatusValue = (typeof companyStatus.enumValues)[number];

// --- Countries & categories --------------------------------------------------

export async function getCountries(): Promise<Country[]> {
    const rows = await db.select().from(countries).orderBy(countries.id);
    return rows.map((c) => ({ id: String(c.id), title: c.title }));
}

export async function getCategories(): Promise<Category[]> {
    const rows = await db.select().from(categories).orderBy(categories.id);
    return rows.map((c) => ({ id: String(c.id), title: c.title }));
}

// --- Companies ---------------------------------------------------------------

const companySelection = {
    id: companies.id,
    title: companies.title,
    description: companies.description,
    status: companies.status,
    joinedDate: companies.joinedDate,
    categoryId: companies.categoryId,
    categoryTitle: categories.title,
    countryId: companies.countryId,
    countryTitle: countries.title,
    avatar: companies.avatar,
    hasPromotions: sql<boolean>`exists (select 1 from ${promotions} where ${promotions.companyId} = ${companies.id})`,
};

type CompanyRow = {
    id: number;
    title: string;
    description: string;
    status: StatusValue;
    joinedDate: string;
    categoryId: number;
    categoryTitle: string;
    countryId: number;
    countryTitle: string;
    avatar: string | null;
    hasPromotions: boolean;
};

function toCompany(row: CompanyRow): Company {
    return {
        id: String(row.id),
        title: row.title,
        description: row.description,
        status: row.status as CompanyStatus,
        joinedDate: row.joinedDate,
        hasPromotions: row.hasPromotions,
        categoryId: String(row.categoryId),
        categoryTitle: row.categoryTitle,
        countryId: String(row.countryId),
        countryTitle: row.countryTitle,
        avatar: row.avatar ?? undefined,
    };
}

const companyQuery = () =>
    db
        .select(companySelection)
        .from(companies)
        .innerJoin(categories, eq(categories.id, companies.categoryId))
        .innerJoin(countries, eq(countries.id, companies.countryId));

export async function getCompanies(): Promise<Company[]> {
    const rows = await companyQuery().orderBy(companies.id);
    return rows.map(toCompany);
}

export async function getCompanyById(id: number): Promise<Company | undefined> {
    const [row] = await companyQuery().where(eq(companies.id, id));
    return row ? toCompany(row) : undefined;
}

type CompanyInput = Omit<Company, 'id' | 'hasPromotions'>;

export async function createCompany(data: CompanyInput): Promise<Company> {
    const [{ id }] = await db
        .insert(companies)
        .values({
            title: data.title,
            description: data.description,
            status: data.status as StatusValue,
            joinedDate: data.joinedDate,
            categoryId: Number(data.categoryId),
            countryId: Number(data.countryId),
            avatar: data.avatar ?? null,
        })
        .returning({ id: companies.id });

    // Re-read so the response carries the joined titles and hasPromotions.
    return (await getCompanyById(id))!;
}

export async function updateCompany(
    id: number,
    data: CompanyInput,
): Promise<Company | undefined> {
    const updated = await db
        .update(companies)
        .set({
            title: data.title,
            description: data.description,
            status: data.status as StatusValue,
            joinedDate: data.joinedDate,
            categoryId: Number(data.categoryId),
            countryId: Number(data.countryId),
            avatar: data.avatar ?? null,
        })
        .where(eq(companies.id, id))
        .returning({ id: companies.id });

    if (updated.length === 0) return undefined;
    return getCompanyById(id);
}

export async function deleteCompany(id: number): Promise<Company | undefined> {
    // Capture the full shape before deleting; FKs cascade to promotions/sales.
    const company = await getCompanyById(id);
    if (!company) return undefined;

    await db.delete(companies).where(eq(companies.id, id));
    return company;
}

// --- Promotions --------------------------------------------------------------

const promotionSelection = {
    id: promotions.id,
    title: promotions.title,
    description: promotions.description,
    discount: promotions.discount,
    companyId: promotions.companyId,
    companyTitle: companies.title,
    avatar: promotions.avatar,
};

type PromotionRow = {
    id: number;
    title: string;
    description: string;
    discount: number;
    companyId: number;
    companyTitle: string;
    avatar: string | null;
};

function toPromotion(row: PromotionRow): Promotion {
    return {
        id: String(row.id),
        title: row.title,
        description: row.description,
        discount: row.discount,
        companyId: String(row.companyId),
        companyTitle: row.companyTitle,
        avatar: row.avatar ?? undefined,
    };
}

const promotionQuery = () =>
    db
        .select(promotionSelection)
        .from(promotions)
        .innerJoin(companies, eq(companies.id, promotions.companyId));

export async function getPromotions(companyId?: number): Promise<Promotion[]> {
    const query = promotionQuery();
    const rows = companyId
        ? await query.where(eq(promotions.companyId, companyId))
        : await query.orderBy(promotions.id);
    return rows.map(toPromotion);
}

export async function getPromotionById(
    id: number,
): Promise<Promotion | undefined> {
    const [row] = await promotionQuery().where(eq(promotions.id, id));
    return row ? toPromotion(row) : undefined;
}

type PromotionInput = Omit<Promotion, 'id'>;

export async function createPromotion(
    data: PromotionInput,
): Promise<Promotion> {
    const [{ id }] = await db
        .insert(promotions)
        .values({
            title: data.title,
            description: data.description,
            discount: data.discount,
            companyId: Number(data.companyId),
            avatar: data.avatar ?? null,
        })
        .returning({ id: promotions.id });

    return (await getPromotionById(id))!;
}

export async function updatePromotion(
    id: number,
    data: PromotionInput,
): Promise<Promotion | undefined> {
    const updated = await db
        .update(promotions)
        .set({
            title: data.title,
            description: data.description,
            discount: data.discount,
            companyId: Number(data.companyId),
            avatar: data.avatar ?? null,
        })
        .where(eq(promotions.id, id))
        .returning({ id: promotions.id });

    if (updated.length === 0) return undefined;
    return getPromotionById(id);
}

export async function deletePromotion(
    id: number,
): Promise<Promotion | undefined> {
    const promotion = await getPromotionById(id);
    if (!promotion) return undefined;

    await db.delete(promotions).where(eq(promotions.id, id));
    return promotion;
}

// --- Sales & stats -----------------------------------------------------------

export async function getSummarySales(): Promise<SummarySales[]> {
    const rows = await db
        .select({
            id: summarySales.id,
            companyId: summarySales.companyId,
            companyTitle: companies.title,
            sold: summarySales.sold,
            income: summarySales.income,
        })
        .from(summarySales)
        .innerJoin(companies, eq(companies.id, summarySales.companyId))
        .orderBy(summarySales.id);

    return rows.map((r) => ({
        id: String(r.id),
        companyId: String(r.companyId),
        companyTitle: r.companyTitle,
        sold: r.sold,
        income: r.income,
    }));
}

export async function getSummaryStats(): Promise<SummaryStats> {
    const [row] = await db
        .select({
            promotions: sql<number>`(select count(*) from ${promotions})`,
            categories: sql<number>`(select count(*) from ${categories})`,
            newCompanies: sql<number>`(select count(*) from ${companies} where extract(year from ${companies.joinedDate}) >= 2024)`,
            activeCompanies: sql<number>`(select count(*) from ${companies} where ${companies.status} = 'active')`,
        })
        .from(sql`(select 1) as _`);

    return {
        promotions: Number(row.promotions),
        categories: Number(row.categories),
        newCompanies: Number(row.newCompanies),
        activeCompanies: Number(row.activeCompanies),
    };
}
