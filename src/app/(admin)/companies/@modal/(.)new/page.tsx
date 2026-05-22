'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CompanyForm from '../../../../components/company-form';
import Modal from '../../../../components/modal';

// export interface PageProps {}

export default function Page({}) {
    const router = useRouter();
    return (
        <Modal show={true} onClose={() => router.back()}>
            <CompanyForm onSubmit={console.log} />
        </Modal>
    );
}
