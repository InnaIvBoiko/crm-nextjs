'use client';

import { use } from 'react';
import PromotionForm from '@/src/app/components/promotion-form';

export interface PageProps {
    params: Promise<{ id: string; promotionId: string }>;
}

export default function Page({ params }: PageProps) {
    const { id, promotionId } = use(params);
    return (
        <div className='py-6 px-10'>
            <PromotionForm companyId={id} promotionId={promotionId} />
        </div>
    );
}
