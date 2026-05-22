'use client';

import React from 'react';

export interface ErrorProps {
    error: Error;
}

export default function Error({ error }: ErrorProps) {
    return <div>Unexpected error inside slot promotions: {error.message}</div>;
}
