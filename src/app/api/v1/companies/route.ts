import { type NextRequest } from 'next/server';
import { type Company } from '@/src/lib/api';
import { companies } from '@/src/lib/mock-data';

// GET /api/v1/companies
export async function GET() {
    return Response.json(companies);
}

// POST /api/v1/companies
// Creates a company and appends it to the in-memory mock store.
export async function POST(request: NextRequest) {
    const data = (await request.json()) as Omit<
        Company,
        'id' | 'hasPromotions'
    >;

    const nextId =
        companies.reduce(
            (max, { id }) => Math.max(max, Number(id) || 0),
            0,
        ) + 1;

    const company: Company = {
        ...data,
        id: String(nextId),
        hasPromotions: false,
    };
    companies.push(company);

    return Response.json(company, { status: 201 });
}
