'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import StatusLabel from './status-label';
import { Company } from '@/src/lib/api';

export interface CompanyRowProps {
    company: Company;
}

export default function CompanyRow({ company }: CompanyRowProps) {
    const router = useRouter();
    const href = `/companies/${company.id}`;

    return (
        <tr
            onClick={() => router.push(href)}
            className='h-14 cursor-pointer text-center text-gray-900 bg-white transition-colors hover:bg-gray-50'
        >
            <td className='px-2 text-xs font-medium text-blue-700 rounded-l border-l-4 border-blue-700 whitespace-nowrap'>
                {company.categoryTitle}
            </td>
            <td className='px-2 whitespace-nowrap'>
                {/* Keep a real link for keyboard navigation; the row onClick
                    makes the whole row clickable for mouse users. */}
                <Link href={href} className='hover:underline'>
                    {company.title}
                </Link>
            </td>
            <td className='px-2'>
                <StatusLabel status={company.status} />
            </td>
            <td className='px-2'>
                <div className='inline-flex items-center gap-1'>
                    <Image
                        width={16}
                        height={16}
                        src={`/icons/${company.hasPromotions ? 'check' : 'x-mark'}.svg`}
                        alt='promotion icon'
                    />
                    <span
                        className={clsx(
                            'text-sm font-medium',
                            company.hasPromotions
                                ? 'text-green-700'
                                : 'text-red-700',
                        )}
                    >
                        {company.hasPromotions ? 'Yes' : 'No'}
                    </span>
                </div>
            </td>
            <td className='px-2'>{company.countryTitle}</td>
            <td className='px-2 rounded-r whitespace-nowrap'>
                {new Date(company.joinedDate).toLocaleDateString('uk-UA')}
            </td>
        </tr>
    );
}
