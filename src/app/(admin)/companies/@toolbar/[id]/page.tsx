import React from 'react';
import AddPromotionButton from '@/src/app/components/add-promotion-button';
import SearchInput from '@/src/app/components/search-input';
import Toolbar from '@/src/app/components/toolbar';

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return (
        <Toolbar action={<AddPromotionButton companyId={id} />}>
            <SearchInput />
        </Toolbar>
    );
}
