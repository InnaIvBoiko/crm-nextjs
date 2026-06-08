import { describe, expect, it } from 'vitest';
import {
    categories,
    companies,
    countries,
    promotions,
    summarySales,
} from '@/src/lib/mock-data';

/**
 * The dashboard aggregates assume every cross-reference resolves. These tests
 * guard that referential integrity so a bad edit to the seed data fails loudly
 * instead of silently skewing the metrics.
 */
describe('mock-data referential integrity', () => {
    const countryIds = new Set(countries.map((c) => c.id));
    const categoryIds = new Set(categories.map((c) => c.id));
    const companyIds = new Set(companies.map((c) => c.id));

    it('has unique company ids', () => {
        expect(companyIds.size).toBe(companies.length);
    });

    it('points every company at a real country and category', () => {
        for (const company of companies) {
            expect(countryIds.has(company.countryId)).toBe(true);
            expect(categoryIds.has(company.categoryId)).toBe(true);
        }
    });

    it('points every promotion at a real company', () => {
        for (const promotion of promotions) {
            expect(companyIds.has(promotion.companyId)).toBe(true);
        }
    });

    it('points every sales row at a real company', () => {
        for (const sale of summarySales) {
            expect(companyIds.has(sale.companyId)).toBe(true);
        }
    });
});
