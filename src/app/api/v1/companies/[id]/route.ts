import { type Company } from '@/src/lib/api';
import {
    deleteCompany,
    getCompanyById,
    updateCompany,
} from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/companies/:id
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const company = await getCompanyById(Number(id));

    if (!company) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(company);
}

// PUT /api/v1/companies/:id
// `id` and `hasPromotions` are preserved — they are not part of the editable
// form payload.
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const data = (await request.json()) as Omit<
        Company,
        'id' | 'hasPromotions'
    >;

    const updated = await updateCompany(Number(id), data);

    if (!updated) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(updated);
}

// DELETE /api/v1/companies/:id
// Removing the company cascades to its promotions and sales via foreign keys.
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const deleted = await deleteCompany(Number(id));

    if (!deleted) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(deleted);
}
