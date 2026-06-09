import { getCountries } from '@/src/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/v1/countries
export async function GET() {
    return Response.json(await getCountries());
}
