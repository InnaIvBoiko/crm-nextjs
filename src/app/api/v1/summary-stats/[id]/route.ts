import { CompanyStatus, type SummaryStats } from '@/src/lib/api';
import { categories, companies, promotions } from '@/src/lib/mock-data';

// GET /api/v1/summary-stats/:id
// The aggregates are computed from the mock data so they always stay in sync.
export async function GET() {
    const stats: SummaryStats = {
        promotions: promotions.length,
        categories: categories.length,
        newCompanies: companies.filter(
            (company) => Number(company.joinedDate.slice(0, 4)) >= 2024,
        ).length,
        activeCompanies: companies.filter(
            (company) => company.status === CompanyStatus.Active,
        ).length,
    };

    return Response.json(stats);
}
