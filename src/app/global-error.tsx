'use client';

import React from 'react';

// export interface GlobalErrorProps {}

export default function GlobalError({}) {
    return (
        <html>
            <head>
                <title>Error</title>
            </head>
            <body>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Something globally went wrong
                    </h1>
                    <p className='mt-2 text-gray-600'>
                        Please try again later.
                    </p>
                </div>
            </body>
        </html>
    );
}
