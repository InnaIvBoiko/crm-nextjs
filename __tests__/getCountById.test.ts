import { describe, expect, it } from 'vitest';
import getCountById from '@/src/lib/utils/getCountById';

describe('getCountById', () => {
    it('counts occurrences grouped by the given key', () => {
        const rows = [
            { companyId: 'a' },
            { companyId: 'b' },
            { companyId: 'a' },
            { companyId: 'a' },
        ];

        expect(getCountById(rows, 'companyId')).toEqual({ a: 3, b: 1 });
    });

    it('returns an empty map for an empty list', () => {
        expect(getCountById([] as { id: string }[], 'id')).toEqual({});
    });

    it('groups by the requested key when rows have several keys', () => {
        const rows = [
            { categoryId: '1', countryId: 'x' },
            { categoryId: '1', countryId: 'y' },
            { categoryId: '2', countryId: 'x' },
        ];

        expect(getCountById(rows, 'categoryId')).toEqual({ '1': 2, '2': 1 });
        expect(getCountById(rows, 'countryId')).toEqual({ x: 2, y: 1 });
    });
});
