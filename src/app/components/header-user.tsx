'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Button from './button';
import AuthModal from './auth-modal';
import { useAuth } from './auth-provider';

function UserIcon() {
    return (
        <span className='flex h-11 w-11 items-center justify-center rounded-full bg-gray-100'>
            <svg
                className='h-6 w-6 text-gray-400'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.6}
                aria-hidden='true'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                />
            </svg>
        </span>
    );
}

export default function HeaderUser() {
    const { user, isAdmin } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    if (user) {
        return (
            <div className='flex items-center gap-3'>
                {isAdmin ? (
                    <Image
                        width={44}
                        height={44}
                        src='/images/avatar.png'
                        alt='avatar'
                    />
                ) : (
                    <UserIcon />
                )}
                <div className='hidden sm:block'>
                    <div className='flex items-center gap-2'>
                        <p className='text-base font-semibold text-gray-900'>
                            {user.name}
                        </p>
                        <span
                            className={clsx(
                                'rounded-full px-2 py-0.5 text-xs font-medium',
                                isAdmin
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600',
                            )}
                        >
                            {isAdmin ? 'Admin' : 'User'}
                        </span>
                    </div>
                    <p className='text-sm font-light text-gray-900'>
                        {user.email}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='flex items-center gap-2 sm:gap-4'>
                <div className='flex items-center gap-3'>
                    <UserIcon />
                    <p className='hidden sm:block text-base font-semibold text-gray-900'>
                        Guest
                    </p>
                </div>
                <Button onClick={() => setShowAuth(true)}>
                    <span className='whitespace-nowrap'>Log in</span>
                </Button>
            </div>
            <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
        </>
    );
}
