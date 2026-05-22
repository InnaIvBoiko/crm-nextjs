import { type NextRequest } from 'next/server';
import { type Promotion } from '@/src/lib/api';
import { companies, promotions } from '@/src/lib/mock-data';

// GET /api/v1/promotions
// Supports mockapi-style field filtering, e.g. /api/v1/promotions?companyId=2
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const sample = promotions[0];

    let result: Promotion[] = promotions;

    for (const [key, value] of searchParams.entries()) {
        if (sample && key in sample) {
            result = result.filter(
                (promotion) =>
                    String(promotion[key as keyof Promotion]) === value,
            );
        }
    }

    return Response.json(result);
}

// POST /api/v1/promotions
// Creates a promotion and appends it to the in-memory mock store.
export async function POST(request: NextRequest) {
    const data = (await request.json()) as Omit<Promotion, 'id'>;

    const nextId =
        promotions.reduce(
            (max, { id }) => Math.max(max, Number(id) || 0),
            0,
        ) + 1;

    const promotion: Promotion = { ...data, id: String(nextId) };
    promotions.push(promotion);

    // Keep the owning company's `hasPromotions` flag consistent.
    const company = companies.find(({ id }) => id === promotion.companyId);
    if (company) {
        company.hasPromotions = true;
    }

    return Response.json(promotion, { status: 201 });
}
