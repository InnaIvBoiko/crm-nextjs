'use client';

import { getCompanies } from '@/src/lib/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import CompanyRow from './company-row';
import CompanyCard from './company-card';

export interface CompanyTableProps {
    children?: React.ReactNode;
}

const headers = [
    'Category',
    'Company',
    'Status',
    'Promotion',
    'Country',
    'Joined date',
];

export default function CompanyTable({}: CompanyTableProps) {
    const { data } = useQuery({
        queryKey: ['companies'],
        queryFn: () => getCompanies(),
        staleTime: 10 * 1000,
    });
    return (
        <div className='py-4 md:py-8 px-4 md:px-10 bg-gray-100'>
            <div className='flex flex-col gap-3 lg:hidden'>
                {data?.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </div>
            <div className='hidden lg:block overflow-x-auto'>
                <table className='table-auto w-full border-separate border-spacing-y-2'>
                    <thead>
                        <tr>
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className='pb-5 px-2 text-sm font-light text-gray-900'
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((company) => (
                            <CompanyRow key={company.id} company={company} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
