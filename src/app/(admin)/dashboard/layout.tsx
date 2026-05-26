import React from 'react';

export interface LayoutProps {
    children: React.ReactNode;
    stats: React.ReactNode;
    sales: React.ReactNode;
    categories: React.ReactNode;
    countries: React.ReactNode;
    promotions: React.ReactNode;
}

export default function Layout({
    children,
    stats,
    sales,
    categories,
    countries,
    promotions,
}: LayoutProps) {
    return (
        <>
            {children}
            <main className='grid grid-cols-12 gap-5 py-6 px-4 md:py-10 md:pl-10 md:pr-7'>
                <div className='col-span-12'>{stats}</div>
                <div className='col-span-12 lg:col-span-5'>{sales}</div>
                <div className='col-span-12 lg:col-span-7'>{categories}</div>
                <div className='col-span-12 md:col-span-6'>{countries}</div>
                <div className='col-span-12 md:col-span-6'>{promotions}</div>
            </main>
        </>
    );
}
