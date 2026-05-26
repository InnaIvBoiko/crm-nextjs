'use client';

import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';

export interface ModalProps {
    children?: React.ReactNode;
    show: boolean;
    onClose: () => void;
    /** Overrides the panel width (defaults to `sm:max-w-2xl`). */
    panelClassName?: string;
}

export default function Modal({
    show,
    children,
    onClose,
    panelClassName,
}: ModalProps) {
    return (
        <Transition.Root as={Fragment} show={show}>
            <Dialog
                as='div'
                className='fixed inset-0 z-50 flex items-center'
                onClose={onClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-gray-500/75 transition-opacity' />
                </Transition.Child>
                <Dialog.Panel
                    className={clsx(
                        'relative transform overflow-y-auto rounded-lg bg-white shadow-xl transition-all p-4 sm:p-7 w-full mx-4 my-4 sm:my-10 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-5rem)]',
                        panelClassName ?? 'sm:max-w-2xl',
                    )}
                >
                    {children}
                </Dialog.Panel>
            </Dialog>
        </Transition.Root>
    );
}
