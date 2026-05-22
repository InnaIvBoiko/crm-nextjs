'use client';

import React from 'react';
import { Field } from 'formik';

export interface InputFieldProps {
    required?: boolean;
    label?: string;
    id?: string;
    name: string;
    placeholder?: string;
    type?: string;
    as?: string;
    children?: React.ReactNode;
}

export default function InputField({ label, id, ...rest }: InputFieldProps) {
    return (
        <div className='flex flex-col'>
            {label && (
                <label htmlFor={id} className='mb-2 text-base text-gray-900'>
                    {label}
                </label>
            )}
            <Field
                {...rest}
                id={id}
                className='p-3 h-11 text-sm rounded border border-gray-300 shadow'
            />
        </div>
    );
}
