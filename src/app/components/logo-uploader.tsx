'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export interface LogoUploaderProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type'
> {
    square?: boolean;
    label?: string;
}

export default function LogoUploader({
    label,
    placeholder,
    id,
    square,
    ...rest
}: LogoUploaderProps) {
    return (
        <div
            className={clsx(
                'mb-3',
                square ? 'flex flex-col gap-2' : 'flex gap-10',
            )}
        >
            {label && <p className='text-base color-gray-900'>{label}</p>}
            <label
                htmlFor={id}
                className={clsx(
                    'flex flex-col items-center justify-center bg-white border border-slate-900 border-dashed cursor-pointer',
                    square
                        ? 'w-full h-72 rounded-2xl'
                        : 'w-40 h-40 rounded-full',
                )}
            >
                <Image
                    className='mb-1'
                    width={48}
                    height={48}
                    src='/icons/upload.svg'
                    alt='upload'
                />
                {placeholder && (
                    <p className='text-base text-gray-500'>{placeholder}</p>
                )}
                <input
                    id={id}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    {...rest}
                />
            </label>
        </div>
    );
}
