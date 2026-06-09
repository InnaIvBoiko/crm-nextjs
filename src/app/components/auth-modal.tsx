'use client';

import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Modal from './modal';
import Button from './button';
import InputField from './input-field';
import { DEMO_ACCOUNTS, useAuth } from './auth-provider';

type Mode = 'login' | 'register';

export interface AuthModalProps {
    show: boolean;
    onClose: () => void;
}

type Credentials = { email: string; password: string };

const DEMO_ROWS = [
    {
        ...DEMO_ACCOUNTS.admin,
        label: 'Admin',
        hint: 'full access — create / edit / delete',
    },
    { ...DEMO_ACCOUNTS.user, label: 'User', hint: 'read-only' },
];

/** Ready-made demo logins shown above the form; each "Use" prefills the fields. */
function DemoAccounts({ onUse }: { onUse: (creds: Credentials) => void }) {
    return (
        <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4'>
            <p className='text-sm font-semibold text-gray-900'>
                🔑 Demo accounts
            </p>
            <p className='mt-0.5 text-xs text-gray-500'>
                Sign in instantly to try both roles.
            </p>
            <ul className='mt-3 flex flex-col gap-2'>
                {DEMO_ROWS.map(({ email, password, label, hint }) => (
                    <li
                        key={email}
                        className='flex items-center justify-between gap-3'
                    >
                        <div className='min-w-0'>
                            <p className='text-sm font-medium text-gray-900'>
                                {label}{' '}
                                <span className='font-normal text-gray-400'>
                                    — {hint}
                                </span>
                            </p>
                            <p className='truncate font-mono text-xs text-gray-500'>
                                {email} · {password}
                            </p>
                        </div>
                        <button
                            type='button'
                            onClick={() => onUse({ email, password })}
                            className='shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100'
                        >
                            Use
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<Mode>('login');
    const { login, register } = useAuth();

    const isLogin = mode === 'login';

    const handleClose = () => {
        onClose();
        // Reopen on the login view next time.
        setMode('login');
    };

    return (
        <Modal show={show} onClose={handleClose} panelClassName='sm:max-w-md'>
            <div className='flex flex-col gap-6'>
                <div>
                    <p className='text-xl font-semibold text-gray-900'>
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                        {isLogin
                            ? 'Log in to access your CRM dashboard.'
                            : 'Sign up to start browsing companies and promotions.'}
                    </p>
                </div>

                {isLogin ? (
                    <Formik
                        key='login'
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => {
                            login(values.email, values.password);
                            handleClose();
                        }}
                    >
                        {({ setValues }) => (
                            <Form className='flex flex-col gap-5'>
                                <DemoAccounts onUse={(creds) => setValues(creds)} />
                                <InputField
                                    required
                                    label='Email'
                                    type='email'
                                    name='email'
                                    id='login-email'
                                    placeholder='you@example.com'
                                />
                                <InputField
                                    required
                                    label='Password'
                                    type='password'
                                    name='password'
                                    id='login-password'
                                    placeholder='••••••••'
                                />
                                <Button type='submit'>Log in</Button>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        key='register'
                        initialValues={{ name: '', email: '', password: '' }}
                        onSubmit={(values) => {
                            register(values.name, values.email, values.password);
                            handleClose();
                        }}
                    >
                        <Form className='flex flex-col gap-5'>
                            <InputField
                                required
                                label='Full name'
                                name='name'
                                id='register-name'
                                placeholder='Jane Doe'
                            />
                            <InputField
                                required
                                label='Email'
                                type='email'
                                name='email'
                                id='register-email'
                                placeholder='you@example.com'
                            />
                            <InputField
                                required
                                label='Password'
                                type='password'
                                name='password'
                                id='register-password'
                                placeholder='••••••••'
                            />
                            <Button type='submit'>Create account</Button>
                        </Form>
                    </Formik>
                )}

                <p className='text-center text-sm text-gray-500'>
                    {isLogin
                        ? "Don't have an account? "
                        : 'Already have an account? '}
                    <button
                        type='button'
                        onClick={() => setMode(isLogin ? 'register' : 'login')}
                        className='font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700'
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </Modal>
    );
}
