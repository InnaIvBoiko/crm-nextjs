'use client';

import React from 'react';
import clsx from 'clsx';

interface IconButtonProps {
    onClick: () => void;
    label: string;
    danger?: boolean;
    children: React.ReactNode;
}

function IconButton({ onClick, label, danger, children }: IconButtonProps) {
    return (
        <button
            type='button'
            onClick={onClick}
            aria-label={label}
            className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-colors',
                danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-900 hover:bg-gray-100',
            )}
        >
            {children}
        </button>
    );
}

export interface CardActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    editLabel?: string;
    deleteLabel?: string;
}

/**
 * Edit + delete buttons shown in the top-right corner of a card. Hidden until
 * the card (a `group`) is hovered or one of the buttons receives focus.
 */
export default function CardActions({
    onEdit,
    onDelete,
    editLabel = 'Edit',
    deleteLabel = 'Delete',
}: CardActionsProps) {
    return (
        <div className='absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'>
            <IconButton onClick={onEdit} label={editLabel}>
                <svg
                    className='h-[18px] w-[18px]'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={1.7}
                    aria-hidden='true'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125'
                    />
                </svg>
            </IconButton>
            <IconButton onClick={onDelete} label={deleteLabel} danger>
                <svg
                    className='h-[18px] w-[18px]'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={1.7}
                    aria-hidden='true'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                    />
                </svg>
            </IconButton>
        </div>
    );
}
