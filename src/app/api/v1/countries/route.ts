import { countries } from '@/src/lib/mock-data';

// GET /api/v1/countries
export async function GET() {
    return Response.json(countries);
}
