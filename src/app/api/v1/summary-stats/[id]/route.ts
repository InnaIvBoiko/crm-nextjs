import { getSummaryStats } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/summary-stats/:id
// Aggregates are computed in SQL so they always reflect the current data.
export async function GET() {
    return Response.json(await getSummaryStats());
}
