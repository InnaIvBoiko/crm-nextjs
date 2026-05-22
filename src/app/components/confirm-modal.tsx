'use client';

import React from 'react';
import Modal from './modal';

export interface ConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    isPending?: boolean;
}

/** Generic "are you sure?" dialog for destructive actions. */
export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Delete',
    isPending,
}: ConfirmModalProps) {
    return (
        <Modal show={show} onClose={onClose} panelClassName='sm:max-w-md'>
            <div className='flex flex-col gap-6'>
                <div>
                    <p className='text-xl font-semibold text-gray-900'>
                        {title}
                    </p>
                    {description && (
                        <p className='mt-1 text-sm text-gray-500'>
                            {description}
                        </p>
                    )}
                </div>
                <div className='flex gap-3'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isPending}
                        className='flex-1 rounded border border-gray-300 px-5 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 disabled:opacity-60'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={onConfirm}
                        disabled={isPending}
                        className='flex-1 rounded bg-red-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60'
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
