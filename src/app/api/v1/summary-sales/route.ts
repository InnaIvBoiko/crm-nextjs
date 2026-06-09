import { getSummarySales } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/summary-sales
export async function GET() {
    return Response.json(await getSummarySales());
}
