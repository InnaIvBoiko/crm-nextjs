'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SidebarItem from './sidebar-item';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';

// export interface SidebarProps {}

export default function Sidebar({}) {
    const router = useRouter();
    const currentPath = usePathname();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    const handleExitClick = () => {
        logout();
        router.push('/');
    };

    const closeOnMobile = () => setOpen(false);

    return (
        <>
            <button
                type='button'
                aria-label='Toggle navigation'
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className='lg:hidden fixed top-3 left-3 z-50 p-2 rounded bg-gray-900'
            >
                <span className='block w-5 h-0.5 bg-white mb-1' />
                <span className='block w-5 h-0.5 bg-white mb-1' />
                <span className='block w-5 h-0.5 bg-white' />
            </button>

            {open && (
                <div
                    className='lg:hidden fixed inset-0 z-30 bg-black/50'
                    onClick={closeOnMobile}
                    aria-hidden='true'
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 w-60 h-screen transition-transform lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex flex-col h-full overflow-y-auto bg-gray-900'>
                    <Link
                        href='/'
                        aria-label='Go to home page'
                        className='block w-fit py-8 mb-11 mx-auto'
                        onClick={closeOnMobile}
                    >
                        <Image
                            width={122}
                            height={25}
                            src='/icons/logo.svg'
                            alt='logo'
                        />
                    </Link>
                    <ul className='space-y-7' onClick={closeOnMobile}>
                        <SidebarItem
                            current={currentPath === '/dashboard'}
                            pathname='/dashboard'
                            src='/icons/squares.svg'
                            alt='dashboard icon'
                        >
                            Dashboard
                        </SidebarItem>
                        <SidebarItem
                            current={currentPath === '/companies'}
                            pathname='/companies'
                            src='/icons/briefcase.svg'
                            alt='companies icon'
                        >
                            Companies
                        </SidebarItem>
                    </ul>
                    <button
                        onClick={handleExitClick}
                        className='flex items-center gap-2 p-6 mt-auto mx-auto'
                    >
                        <Image
                            width={18}
                            height={18}
                            src='/icons/arrow-left-on-rectangle.svg'
                            alt='exit icon'
                        />
                        <span className='font-medium text-white'>Exit</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
