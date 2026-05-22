import { companies } from '@/src/lib/mock-data';

// GET /api/v1/companies
export async function GET() {
    return Response.json(companies);
}
