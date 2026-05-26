import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { getCompanies, getCountries } from '../../../../lib/api';
import DashboardCard from '../../../components/dashboard-card';
import getCountById from '@/src/lib/utils/getCountById';

// export interface PageProps {}

export default async function Page({}) {
    const companies = await getCompanies();
    const countries = await getCountries();

    const counts = getCountById(companies, 'countryId');

    return (
        <DashboardCard label='Countries of companies'>
            <div className='flex flex-col md:flex-row md:items-end pb-5 px-5 gap-4 md:gap-2'>
                <div className='flex flex-wrap gap-x-4 gap-y-1 md:block'>
                    {countries.map(({ id, title }) => (
                        <p
                            key={id}
                            className={clsx(
                                'text-sm text-gray-900 font-medium whitespace-nowrap',
                                'before:inline-block before:w-2 before:h-2 before:rounded-full before:align-middle before:mr-2 before:bg-purple-200',
                            )}
                        >{`${title} - ${counts[id] || 0}`}</p>
                    ))}
                </div>
                <div className='w-full max-w-md md:max-w-none md:w-auto'>
                    <Image
                        width={396}
                        height={262}
                        src='/images/world.svg'
                        alt='world'
                        loading='eager'
                        sizes='(max-width: 768px) 100vw, 396px'
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            </div>
        </DashboardCard>
    );
}
