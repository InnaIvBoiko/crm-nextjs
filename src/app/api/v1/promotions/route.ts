import { type NextRequest } from 'next/server';
import { type Promotion } from '@/src/lib/api';
import { createPromotion, getPromotions } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/promotions
// Supports filtering by company, e.g. /api/v1/promotions?companyId=2
export async function GET(request: NextRequest) {
    const companyId = request.nextUrl.searchParams.get('companyId');

    const promotions = await getPromotions(
        companyId ? Number(companyId) : undefined,
    );

    return Response.json(promotions);
}

// POST /api/v1/promotions
export async function POST(request: NextRequest) {
    const data = (await request.json()) as Omit<Promotion, 'id'>;

    const promotion = await createPromotion(data);

    return Response.json(promotion, { status: 201 });
}
