'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CompanyFormModal from '@/src/app/components/company-form-modal';

// export interface PageProps {}

export default function Page({}) {
    const router = useRouter();

    return <CompanyFormModal show={true} onClose={() => router.back()} />;
}
