'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import CompanyFormModal from '@/src/app/components/company-form-modal';

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    return (
        <CompanyFormModal
            companyId={id}
            show={true}
            onClose={() => router.back()}
        />
    );
}
