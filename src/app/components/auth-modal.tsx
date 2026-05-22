'use client';

import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Modal from './modal';
import Button from './button';
import InputField from './input-field';
import { useAuth } from './auth-provider';

type Mode = 'login' | 'register';

export interface AuthModalProps {
    show: boolean;
    onClose: () => void;
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
                            : 'Sign up to start managing companies and promotions.'}
                    </p>
                </div>

                {isLogin ? (
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => {
                            login(values.email, values.password);
                            handleClose();
                        }}
                    >
                        <Form className='flex flex-col gap-5'>
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
                    </Formik>
                ) : (
                    <Formik
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
