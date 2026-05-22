'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCompany, getCompany } from '@/src/lib/api';
import StatusLabel from './status-label';
import CardActions from './card-actions';
import ConfirmModal from './confirm-modal';

export interface CompanyInfoProps {
    companyId: string;
}

export default function CompanyInfo({ companyId }: CompanyInfoProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data: company } = useQuery({
        queryKey: ['companies', companyId],
        queryFn: () => getCompany(companyId),
        staleTime: 10 * 1000,
    });

    const { mutate: removeCompany, isPending } = useMutation({
        mutationFn: () => deleteCompany(companyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            setConfirmOpen(false);
            router.push('/companies');
        },
    });

    if (!company) return null;
    return (
        <div className='flex flex-col gap-5'>
            <div className='group relative flex flex-col items-center p-7 gap-5 bg-gray-900 rounded'>
                <CardActions
                    editLabel='Edit company'
                    deleteLabel='Delete company'
                    onEdit={() => router.push(`/companies/${companyId}/edit`)}
                    onDelete={() => setConfirmOpen(true)}
                />
                <div className='relative w-20 h-20 overflow-hidden rounded-full bg-blue-500'>
                    {company.avatar && (
                        <Image
                            fill
                            unoptimized
                            src={company.avatar}
                            alt='company avatar'
                            className='object-cover'
                        />
                    )}
                </div>
                <p className='pb text-base font-semibold text-white'>
                    {company.title}
                </p>
                <StatusLabel status={company.status} />
            </div>
            <div className='p-7 text-base text-gray-900 bg-gray-100 rounded'>
                <p className='pb-5 text-xl font-semibold'>About company</p>
                <p className='pb-3'>{`Category: ${company.categoryTitle}`}</p>
                <p className='pb-3'>{`Country: ${company.countryTitle}`}</p>
                <p className='pb-3'>{`Joined date: ${new Date(
                    company.joinedDate,
                ).toLocaleDateString('uk')}`}</p>
                <div className='w-full h-px my-8 bg-gray-300' />
                <p>{company.description}</p>
            </div>
            <ConfirmModal
                show={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => removeCompany()}
                isPending={isPending}
                title='Delete company?'
                description={`"${company.title}" and all of its promotions will be permanently removed.`}
                confirmLabel='Delete company'
            />
        </div>
    );
}
