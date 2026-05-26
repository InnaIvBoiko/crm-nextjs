import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import StatusLabel from './status-label';
import { Company } from '@/src/lib/api';

export interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <Link
            href={`/companies/${company.id}`}
            className='block bg-white rounded border-l-4 border-blue-700 p-4'
        >
            <p className='text-xs font-medium text-blue-700 mb-1'>
                {company.categoryTitle}
            </p>
            <div className='flex items-center justify-between gap-3 mb-3'>
                <p className='text-base font-semibold text-gray-900'>
                    {company.title}
                </p>
                <StatusLabel status={company.status} />
            </div>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700'>
                <span className='inline-flex items-center gap-1'>
                    <Image
                        width={14}
                        height={14}
                        src={`/icons/${company.hasPromotions ? 'check' : 'x-mark'}.svg`}
                        alt='promotion icon'
                    />
                    <span
                        className={clsx(
                            'font-medium',
                            company.hasPromotions
                                ? 'text-green-700'
                                : 'text-red-700',
                        )}
                    >
                        {company.hasPromotions ? 'Yes' : 'No'}
                    </span>
                </span>
                <span>·</span>
                <span>{company.countryTitle}</span>
                <span>·</span>
                <span>
                    {new Date(company.joinedDate).toLocaleDateString('uk-UA')}
                </span>
            </div>
        </Link>
    );
}
