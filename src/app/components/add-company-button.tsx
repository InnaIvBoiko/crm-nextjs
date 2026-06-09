'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';
import { useAuth } from './auth-provider';

export default function AddCompanyButton() {
    const router = useRouter();
    const { isAdmin } = useAuth();

    // Only admins can create companies.
    if (!isAdmin) return null;

    return (
        <Button onClick={() => router.push('/companies/new')}>
            Add company
        </Button>
    );
}
