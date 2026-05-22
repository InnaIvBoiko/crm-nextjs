'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import PromotionFormModal from '@/src/app/components/promotion-form-modal';

export interface PageProps {
    params: Promise<{ id: string; promotionId: string }>;
}

export default function Page({ params }: PageProps) {
    const { id, promotionId } = use(params);
    const router = useRouter();
    return (
        <PromotionFormModal
            companyId={id}
            promotionId={promotionId}
            show={true}
            onClose={() => router.back()}
        />
    );
}
