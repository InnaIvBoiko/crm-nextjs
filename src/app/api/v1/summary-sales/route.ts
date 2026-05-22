import { summarySales } from '@/src/lib/mock-data';

// GET /api/v1/summary-sales
export async function GET() {
    return Response.json(summarySales);
}
