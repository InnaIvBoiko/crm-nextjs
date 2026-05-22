'use client';

import React from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromotion, getCompany, Promotion } from '@/src/lib/api';
import InputField from './input-field';
import LogoUploader from './logo-uploader';
import Button from './button';

export type PromotionFieldValues = {
    title: string;
    description: string;
    discount: string | number;
};

const initialValues: PromotionFieldValues = {
    title: '',
    description: '',
    discount: '',
};

export interface PromotionFormProps {
    companyId: string;
    onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

export default function PromotionForm({
    companyId,
    onSubmit,
}: PromotionFormProps) {
    const queryClient = useQueryClient();

    const { data: company } = useQuery({
        queryKey: ['companies', companyId],
        queryFn: () => getCompany(companyId),
        staleTime: 10 * 1000,
        enabled: Boolean(companyId),
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: Omit<Promotion, 'id'>) => createPromotion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['promotions', companyId],
            });

            queryClient.invalidateQueries({
                queryKey: ['promotions'],
                exact: true,
            });
        },
    });

    const handleSubmit = async (values: PromotionFieldValues) => {
        if (!company) {
            // company data is not available yet; avoid submitting until it's loaded
            return;
        }

        await mutateAsync({
            ...values,
            discount: Number(values.discount) || 0,
            companyId: company.id,
            companyTitle: company.title,
        });

        if (onSubmit) {
            onSubmit(values);
        }
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className='flex flex-col gap-10'>
                <p className='mb-0.5 text-xl'>Add new promotion</p>
                <div className='flex flex-col gap-5'>
                    <InputField
                        required
                        label='Title'
                        placeholder='Title'
                        name='title'
                    />
                    <InputField
                        required
                        label='Description'
                        placeholder='Description'
                        name='description'
                    />
                    <InputField
                        required
                        type='number'
                        label='Discount'
                        placeholder='Discount'
                        name='discount'
                    />
                    <LogoUploader
                        square
                        label='Image'
                        placeholder='Upload photo'
                    />
                </div>
                <Button type='submit' disabled={isPending}>
                    Add promotion
                </Button>
            </Form>
        </Formik>
    );
}
