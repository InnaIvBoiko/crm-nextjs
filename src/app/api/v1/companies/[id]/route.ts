import { companies } from '@/src/lib/mock-data';

// GET /api/v1/companies/:id
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const company = companies.find((item) => item.id === id);

    if (!company) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(company);
}
