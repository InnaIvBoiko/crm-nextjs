'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';
import { useAuth } from './auth-provider';

export interface AddPromotionButtonProps {
    companyId: string;
}

export default function AddPromotionButton({
    companyId,
}: AddPromotionButtonProps) {
    const router = useRouter();
    const { isAdmin } = useAuth();

    // Only admins can create promotions.
    if (!isAdmin) return null;

    return (
        <Button
            onClick={() => router.push(`/companies/${companyId}/new-promotion`)}
        >
            Add promotions
        </Button>
    );
}
