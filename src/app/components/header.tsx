import React from 'react';
import HeaderUser from './header-user';

export interface HeaderProps {
    children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    return (
        <header className='flex items-center gap-3 md:gap-5 py-4 md:py-6 pl-14 pr-4 md:pr-10 lg:pl-10 border-b border-gray-300'>
            <h1 className='flex-1 text-xl md:text-3xl font-semibold text-gray-900'>
                {children}
            </h1>
            <div className='hidden md:block w-px self-stretch bg-gray-300' />
            <HeaderUser />
        </header>
    );
}
