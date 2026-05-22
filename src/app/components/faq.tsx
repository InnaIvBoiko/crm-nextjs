'use client';

import React from 'react';
import { Disclosure } from '@headlessui/react';

const faqs = [
    {
        question: 'What can I do with this CRM?',
        answer: 'Keep track of your companies, the promotions tied to each of them, and how sales perform across countries and categories — all from one dashboard.',
    },
    {
        question: 'Do I need to set anything up first?',
        answer: 'No setup required. Open the dashboard and start exploring straight away — companies, promotions and sales are ready to browse and edit.',
    },
    {
        question: 'Can I add and edit companies?',
        answer: 'Yes. From the Companies page you can create new companies with a logo, status and contact details, and update them whenever you need to.',
    },
    {
        question: 'How do promotions work?',
        answer: 'Every promotion is attached to a company. Create, edit and review promotions to follow how each campaign is performing over time.',
    },
    {
        question: 'How is my data organized?',
        answer: 'Companies are grouped across six countries and eight business categories, so you can segment, filter and compare your data with ease.',
    },
];

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
            }`}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.8}
            aria-hidden='true'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m19.5 8.25-7.5 7.5-7.5-7.5'
            />
        </svg>
    );
}

export default function Faq() {
    return (
        <div className='mt-10 space-y-3'>
            {faqs.map(({ question, answer }, index) => (
                <Disclosure
                    key={question}
                    as='div'
                    defaultOpen={index === 0}
                    className='overflow-hidden rounded-2xl bg-gray-100 transition-colors hover:bg-gray-200'
                >
                    {({ open }) => (
                        <>
                            <Disclosure.Button className='flex w-full items-center justify-between gap-4 p-6 text-left'>
                                <span className='text-base font-medium text-gray-900'>
                                    {question}
                                </span>
                                <Chevron open={open} />
                            </Disclosure.Button>
                            <Disclosure.Panel className='px-6 pb-6 text-sm leading-relaxed text-gray-600'>
                                {answer}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </div>
    );
}
