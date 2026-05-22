'use client';

import { use } from 'react';
import CompanyForm from '@/src/app/components/company-form';

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    const { id } = use(params);
    return (
        <div className='py-6 px-10'>
            <CompanyForm companyId={id} />
        </div>
    );
}
