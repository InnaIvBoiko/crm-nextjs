import { type Company } from '@/src/lib/api';
import { companies, promotions } from '@/src/lib/mock-data';

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

// PUT /api/v1/companies/:id
// Updates a company in the in-memory mock store (`id` and `hasPromotions`
// are preserved — they are not part of the editable form payload).
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const index = companies.findIndex((item) => item.id === id);

    if (index === -1) {
        return new Response('Not found!', { status: 404 });
    }

    const data = (await request.json()) as Omit<
        Company,
        'id' | 'hasPromotions'
    >;
    const updated: Company = { ...companies[index], ...data, id };
    companies[index] = updated;

    return Response.json(updated);
}

// DELETE /api/v1/companies/:id
// Removes the company and cascades to the promotions that belong to it.
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const index = companies.findIndex((item) => item.id === id);

    if (index === -1) {
        return new Response('Not found!', { status: 404 });
    }

    const [deleted] = companies.splice(index, 1);

    for (let i = promotions.length - 1; i >= 0; i--) {
        if (promotions[i].companyId === id) {
            promotions.splice(i, 1);
        }
    }

    return Response.json(deleted);
}
