import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Faq from './components/faq';

export const metadata: Metadata = {
    title: 'CRM — Manage companies, promotions and sales',
    description:
        'A fast, focused CRM dashboard to track companies across countries and categories, manage promotions, and keep sales performance in view.',
};

/* ------------------------------------------------------------------ */
/*  Icons — inline so they inherit `currentColor` on the dark tiles.   */
/* ------------------------------------------------------------------ */

interface IconProps {
    className?: string;
}

function IconDashboard({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.6}
            aria-hidden='true'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25Zm9.75-9.75A2.25 2.25 0 0 1 15.75 3.75H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z'
            />
        </svg>
    );
}

function IconCompanies({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.6}
            aria-hidden='true'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 21h19.5M3.75 21V5.25A1.5 1.5 0 0 1 5.25 3.75h6a1.5 1.5 0 0 1 1.5 1.5V21m0-11.25h6a1.5 1.5 0 0 1 1.5 1.5V21M6.75 7.5h.008v.008H6.75V7.5Zm0 3h.008v.008H6.75v-.008Zm0 3h.008v.008H6.75v-.008Zm3-6h.008v.008H9.75V7.5Zm0 3h.008v.008H9.75v-.008Zm0 3h.008v.008H9.75v-.008Zm6 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z'
            />
        </svg>
    );
}

function IconPromotions({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.6}
            aria-hidden='true'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z'
            />
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 6h.008v.008H6V6Z'
            />
        </svg>
    );
}

function IconArrow({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            aria-hidden='true'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.5 12h15m0 0-6-6m6 6-6 6'
            />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function Eyebrow({
    children,
    tone = 'dark',
}: {
    children: React.ReactNode;
    tone?: 'dark' | 'light';
}) {
    // `dark` => placed on a dark surface (lime accent); `light` => on a light surface.
    return (
        <p
            className={
                tone === 'dark'
                    ? 'flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-lime-200'
                    : 'flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500'
            }
        >
            <span
                className={
                    tone === 'dark'
                        ? 'h-0.5 w-5 rounded bg-lime-200'
                        : 'h-0.5 w-5 rounded bg-gray-900'
                }
            />
            {children}
        </p>
    );
}

const features = [
    {
        title: 'Insightful dashboard',
        description:
            'See sales by country, leading categories and active promotions in one focused overview.',
        icon: IconDashboard,
        accent: 'text-lime-200',
    },
    {
        title: 'Company management',
        description:
            'Create, edit and organize companies with logos, statuses and full contact profiles.',
        icon: IconCompanies,
        accent: 'text-purple-200',
    },
    {
        title: 'Promotions tracking',
        description:
            'Attach promotions to each company and follow how every campaign performs over time.',
        icon: IconPromotions,
        accent: 'text-lime-200',
    },
];

const countries = ['USA', 'Germany', 'Japan', 'France', 'Ukraine', 'Brazil'];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
    return (
        <main className='mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6'>
            {/* ---------- Hero ---------- */}
            <section className='relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-8'>
                {/* decorative colored glow */}
                <div
                    aria-hidden='true'
                    className='pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full opacity-60 blur-3xl'
                    style={{
                        backgroundImage: "url('/images/mesh-gradient-2.svg')",
                        backgroundSize: 'cover',
                    }}
                />

                {/* nav */}
                <nav className='relative flex items-center justify-between gap-4'>
                    <Image
                        src='/icons/logo.svg'
                        alt='CRM logo'
                        width={122}
                        height={25}
                        priority
                    />
                    <div className='flex items-center gap-4 sm:gap-7'>
                        <a
                            href='#features'
                            className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-zinc-50 sm:block'
                        >
                            Features
                        </a>
                        <Link
                            href='/dashboard'
                            className='rounded bg-zinc-50 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-white'
                        >
                            Open dashboard
                        </Link>
                    </div>
                </nav>

                {/* hero body */}
                <div className='relative mt-14 grid items-center gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-14'>
                    <div>
                        <Eyebrow tone='dark'>CRM Platform</Eyebrow>
                        <h1 className='mt-5 text-4xl font-semibold leading-[1.1] text-zinc-50 sm:text-5xl lg:text-6xl'>
                            Run your sales relationships from a single dashboard
                        </h1>
                        <p className='mt-5 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg'>
                            Track companies across countries and categories,
                            manage promotions, and keep sales performance in
                            view — a fast, focused CRM for teams that move
                            quickly.
                        </p>
                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Link
                                href='/dashboard'
                                className='inline-flex items-center gap-2 rounded bg-zinc-50 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-white'
                            >
                                Open dashboard
                                <IconArrow className='h-4 w-4' />
                            </Link>
                            <Link
                                href='/companies'
                                className='inline-flex items-center rounded border border-gray-700 px-5 py-3 text-sm font-medium text-zinc-50 transition-colors hover:border-gray-600 hover:bg-gray-800'
                            >
                                Browse companies
                            </Link>
                        </div>
                    </div>

                    {/* product preview card */}
                    <div className='rounded-2xl bg-[#fafafa] p-5 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:p-7'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm font-semibold text-gray-900'>
                                Companies by region
                            </p>
                            <span className='rounded bg-lime-200 px-2.5 py-1 text-xs font-semibold text-gray-900'>
                                6 markets
                            </span>
                        </div>
                        <Image
                            src='/images/world.svg'
                            alt='World map highlighting where companies operate'
                            width={396}
                            height={262}
                            className='mt-4 h-auto w-full'
                        />
                        <div className='mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4'>
                            {countries.map((country) => (
                                <span
                                    key={country}
                                    className='rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'
                                >
                                    {country}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Features ---------- */}
            <section id='features' className='px-1 py-16 sm:py-24'>
                <div className='max-w-2xl'>
                    <Eyebrow tone='light'>What you get</Eyebrow>
                    <h2 className='mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl'>
                        A CRM that keeps the essentials close
                    </h2>
                    <p className='mt-3 text-base leading-relaxed text-gray-600'>
                        Everything for day-to-day account work — no clutter, no
                        setup. Jump straight into the data that matters.
                    </p>
                </div>

                <div className='mt-10 grid gap-5 md:grid-cols-3'>
                    {features.map(
                        ({ title, description, icon: Icon, accent }) => (
                            <div
                                key={title}
                                className='rounded-2xl bg-gray-100 p-7 transition-colors hover:bg-gray-200'
                            >
                                <span className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900'>
                                    <Icon className={`h-6 w-6 ${accent}`} />
                                </span>
                                <h3 className='mt-5 text-lg font-semibold text-gray-900'>
                                    {title}
                                </h3>
                                <p className='mt-2 text-sm leading-relaxed text-gray-600'>
                                    {description}
                                </p>
                            </div>
                        ),
                    )}
                </div>
            </section>

            {/* ---------- FAQ ---------- */}
            <section className='px-1 pb-16 sm:pb-24'>
                <div className='mx-auto max-w-3xl text-center'>
                    <div className='flex justify-center'>
                        <Eyebrow tone='light'>FAQ</Eyebrow>
                    </div>
                    <h2 className='mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl'>
                        Frequently asked questions
                    </h2>
                    <p className='mt-3 text-base leading-relaxed text-gray-600'>
                        Everything you need to know before opening the
                        dashboard.
                    </p>
                </div>
                <div className='mx-auto max-w-3xl text-left'>
                    <Faq />
                </div>
            </section>

            {/* ---------- Call to action ---------- */}
            <section className='relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12 sm:py-20'>
                <div
                    aria-hidden='true'
                    className='pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full opacity-50 blur-3xl'
                    style={{
                        backgroundImage: "url('/images/mesh-gradient-4.svg')",
                        backgroundSize: 'cover',
                    }}
                />
                <h2 className='relative mx-auto max-w-2xl text-3xl font-semibold text-zinc-50 sm:text-4xl'>
                    Ready to get started?
                </h2>
                <p className='relative mx-auto mt-4 max-w-lg text-base text-gray-400'>
                    Open the dashboard and explore your companies, promotions
                    and sales — it is all one click away.
                </p>
                <div className='relative mt-8'>
                    <Link
                        href='/dashboard'
                        className='inline-flex items-center gap-2 rounded bg-lime-200 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-lime-300'
                    >
                        Open dashboard
                        <IconArrow className='h-4 w-4' />
                    </Link>
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className='mt-4 flex flex-col items-center justify-between gap-6 border-t border-gray-200 py-8 sm:flex-row'>
                <span className='inline-flex rounded bg-gray-900 px-3 py-2'>
                    <Image
                        src='/icons/logo.svg'
                        alt='CRM logo'
                        width={98}
                        height={20}
                    />
                </span>
                <div className='flex items-center gap-6 text-sm text-gray-500'>
                    <Link
                        href='/dashboard'
                        className='transition-colors hover:text-gray-900'
                    >
                        Dashboard
                    </Link>
                    <Link
                        href='/companies'
                        className='transition-colors hover:text-gray-900'
                    >
                        Companies
                    </Link>
                </div>
                <p className='text-sm text-gray-400'>
                    © 2026 CRM. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
