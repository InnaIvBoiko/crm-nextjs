import { getCategories } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/categories
export async function GET() {
    return Response.json(await getCategories());
}
