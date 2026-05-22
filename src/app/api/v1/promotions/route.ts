import { type NextRequest } from 'next/server';
import { type Promotion } from '@/src/lib/api';
import { promotions } from '@/src/lib/mock-data';

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
