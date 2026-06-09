import { type NextRequest } from 'next/server';
import { type Company } from '@/src/lib/api';
import { createCompany, getCompanies } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/companies
export async function GET() {
    return Response.json(await getCompanies());
}

// POST /api/v1/companies
export async function POST(request: NextRequest) {
    const data = (await request.json()) as Omit<
        Company,
        'id' | 'hasPromotions'
    >;

    const company = await createCompany(data);

    return Response.json(company, { status: 201 });
}
