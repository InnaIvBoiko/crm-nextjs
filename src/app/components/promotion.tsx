'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePromotion, Promotion as PromotionType } from '@/src/lib/api';
import CardActions from './card-actions';
import ConfirmModal from './confirm-modal';

export interface PromotionProps {
    promotion: PromotionType;
}

export default function Promotion({ promotion }: PromotionProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { mutate: removePromotion, isPending } = useMutation({
        mutationFn: () => deletePromotion(promotion.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['promotions', promotion.companyId],
            });
            queryClient.invalidateQueries({
                queryKey: ['promotions'],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: ['companies', promotion.companyId],
            });
            setConfirmOpen(false);
        },
    });

    return (
        <div className='group relative rounded overflow-hidden	bg-gray-100'>
            <CardActions
                editLabel='Edit promotion'
                deleteLabel='Delete promotion'
                onEdit={() =>
                    router.push(
                        `/companies/${promotion.companyId}/edit-promotion/${promotion.id}`,
                    )
                }
                onDelete={() => setConfirmOpen(true)}
            />
            <div className='relative w-full h-40 bg-gray-300'>
                {promotion.avatar && (
                    <Image
                        fill
                        unoptimized
                        src={promotion.avatar}
                        alt='promotion avatar'
                        className='object-cover'
                    />
                )}
                <div className='w-14 h-14 absolute top-0 left-px rounded-br-full bg-lime-200' />
                <div className='w-14 h-14 absolute inset-0 py-3 pr-3 pl-0.5 rounded-br-full bg-gray-900'>
                    <p className='text-center text-xs font-bold text-lime-200'>{`-${promotion.discount}%`}</p>
                </div>
            </div>
            <div className='flex flex-col p-5 gap-3'>
                <p className='text-base font-semibold text-gray-900'>
                    {promotion.title}
                </p>
                <p className='text-sm text-gray-900'>{promotion.description}</p>
            </div>
            <ConfirmModal
                show={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => removePromotion()}
                isPending={isPending}
                title='Delete promotion?'
                description={`"${promotion.title}" will be permanently removed.`}
                confirmLabel='Delete promotion'
            />
        </div>
    );
}
