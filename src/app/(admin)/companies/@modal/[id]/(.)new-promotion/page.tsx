'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import PromotionFormModal from '@/src/app/components/promotion-form-modal';

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    return (
        <PromotionFormModal
            companyId={id}
            show={true}
            onClose={() => router.back()}
        />
    );
}
