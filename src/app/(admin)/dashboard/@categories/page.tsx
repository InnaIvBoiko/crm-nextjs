import React from 'react';
import { getCategories, getCompanies } from '../../../../lib/api';
import StatCard, {
    StatCardType,
} from '../../../components/stat-card/stat-card';
import DashboardCard from '@/src/app/components/dashboard-card';
import getCountById from '@/src/lib/utils/getCountById';

// export interface PageProps {}

export default async function Page({}) {
    const categories = await getCategories();
    const companies = await getCompanies();

    const counts = getCountById(companies, 'categoryId');

    return (
        <DashboardCard label='Categories of companies'>
            <div className='grid grid-cols-12 gap-3 pb-5 px-5'>
                {categories.map(({ id, title }) => (
                    <div key={id} className='col-span-3'>
                        <StatCard
                            type={StatCardType.Dark}
                            label={title}
                            counter={counts[id] || 0}
                        />
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}
