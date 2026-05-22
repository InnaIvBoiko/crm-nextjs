'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './auth-provider';

export default function Providers({ children }: React.PropsWithChildren) {
    const client = useMemo(() => new QueryClient(), []);

    return (
        <QueryClientProvider client={client}>
            <AuthProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
