import React from 'react';
import Header from '../../../../components/header';
import getQueryClient from '@/src/lib/utils/getQueryClient';
import { Company, getCompany } from '@/src/lib/api';

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['companies', id],
        queryFn: () => getCompany(id, { cache: 'no-store' }),
        staleTime: 10 * 1000,
    });

    const company = queryClient.getQueryData(['companies', id]) as Company;

    return <Header>{company?.title}</Header>;
}
