import { type Promotion } from '@/src/lib/api';
import {
    deletePromotion,
    getPromotionById,
    updatePromotion,
} from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/promotions/:id
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const promotion = await getPromotionById(Number(id));

    if (!promotion) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(promotion);
}

// PUT /api/v1/promotions/:id
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const data = (await request.json()) as Omit<Promotion, 'id'>;

    const updated = await updatePromotion(Number(id), data);

    if (!updated) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(updated);
}

// DELETE /api/v1/promotions/:id
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const deleted = await deletePromotion(Number(id));

    if (!deleted) {
        return new Response('Not found!', { status: 404 });
    }

    return Response.json(deleted);
}
