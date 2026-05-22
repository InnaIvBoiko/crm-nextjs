'use client';

import React, { useId } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export interface LogoUploaderProps {
    square?: boolean;
    label?: string;
    placeholder?: string;
    id?: string;
    /** Current image as a data URL (or an existing avatar URL). */
    value?: string;
    onChange?: (dataUrl: string) => void;
}

export default function LogoUploader({
    label,
    placeholder,
    id,
    square,
    value,
    onChange,
}: LogoUploaderProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // No backend storage — read the file into a data URL so it can be
        // stored as a string and rendered directly.
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                onChange?.(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            className={clsx(
                'mb-3',
                square ? 'flex flex-col gap-2' : 'flex items-center gap-10',
            )}
        >
            {label && <p className='text-base text-gray-900'>{label}</p>}
            <label
                htmlFor={inputId}
                className={clsx(
                    'relative flex flex-col items-center justify-center overflow-hidden bg-white border border-slate-900 border-dashed cursor-pointer',
                    square ? 'w-full h-72 rounded-2xl' : 'w-40 h-40 rounded-full',
                )}
            >
                {value ? (
                    <Image
                        fill
                        unoptimized
                        src={value}
                        alt='upload preview'
                        className='object-cover'
                    />
                ) : (
                    <>
                        <Image
                            className='mb-1'
                            width={48}
                            height={48}
                            src='/icons/upload.svg'
                            alt='upload'
                        />
                        {placeholder && (
                            <p className='text-base text-gray-500'>
                                {placeholder}
                            </p>
                        )}
                    </>
                )}
                <input
                    id={inputId}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}
