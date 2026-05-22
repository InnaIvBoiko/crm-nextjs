import { type Promotion } from '@/src/lib/api';
import { companies, promotions } from '@/src/lib/mock-data';

// GET /api/v1/promotions/:id
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const promotion = promotions.find((item) => item.id === id);

    if (!promotion) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(promotion);
}

// PUT /api/v1/promotions/:id
// Updates a promotion in the in-memory mock store (`id` is preserved).
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const index = promotions.findIndex((item) => item.id === id);

    if (index === -1) {
        return new Response('Not found!', { status: 404 });
    }

    const data = (await request.json()) as Omit<Promotion, 'id'>;
    const updated: Promotion = { ...promotions[index], ...data, id };
    promotions[index] = updated;

    return Response.json(updated);
}

// DELETE /api/v1/promotions/:id
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const index = promotions.findIndex((item) => item.id === id);

    if (index === -1) {
        return new Response('Not found!', { status: 404 });
    }

    const [deleted] = promotions.splice(index, 1);

    // Keep the owning company's `hasPromotions` flag consistent.
    const company = companies.find((item) => item.id === deleted.companyId);
    if (company) {
        company.hasPromotions = promotions.some(
            (item) => item.companyId === deleted.companyId,
        );
    }

    return Response.json(deleted);
}
