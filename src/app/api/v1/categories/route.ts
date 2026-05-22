import { categories } from '@/src/lib/mock-data';

// GET /api/v1/categories
export async function GET() {
    return Response.json(categories);
}
