'use client';

import React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createPromotion,
    getCompany,
    getPromotion,
    Promotion,
    updatePromotion,
} from '@/src/lib/api';
import InputField from './input-field';
import LogoUploader from './logo-uploader';
import Button from './button';

export type PromotionFieldValues = {
    title: string;
    description: string;
    discount: string | number;
    avatar: string;
};

const emptyValues: PromotionFieldValues = {
    title: '',
    description: '',
    discount: '',
    avatar: '',
};

export interface PromotionFormProps {
    companyId: string;
    /** When provided, the form edits that promotion instead of creating one. */
    promotionId?: string;
    onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

export default function PromotionForm({
    companyId,
    promotionId,
    onSubmit,
}: PromotionFormProps) {
    const isEdit = Boolean(promotionId);
    const queryClient = useQueryClient();

    const { data: company } = useQuery({
        queryKey: ['companies', companyId],
        queryFn: () => getCompany(companyId),
        staleTime: 10 * 1000,
        enabled: Boolean(companyId),
    });

    const { data: promotion } = useQuery({
        queryKey: ['promotion', promotionId],
        queryFn: () => getPromotion(promotionId as string),
        staleTime: 10 * 1000,
        enabled: isEdit,
    });

    const invalidatePromotions = () => {
        queryClient.invalidateQueries({
            queryKey: ['promotions', companyId],
        });
        queryClient.invalidateQueries({
            queryKey: ['promotions'],
            exact: true,
        });
    };

    const createMutation = useMutation({
        mutationFn: (data: Omit<Promotion, 'id'>) => createPromotion(data),
        onSuccess: invalidatePromotions,
    });

    const updateMutation = useMutation({
        mutationFn: (data: Omit<Promotion, 'id'>) =>
            updatePromotion(promotionId as string, data),
        onSuccess: () => {
            invalidatePromotions();
            queryClient.invalidateQueries({
                queryKey: ['promotion', promotionId],
            });
        },
    });

    const { mutateAsync, isPending } = isEdit ? updateMutation : createMutation;

    const initialValues: PromotionFieldValues =
        isEdit && promotion
            ? {
                  title: promotion.title,
                  description: promotion.description,
                  discount: promotion.discount,
                  avatar: promotion.avatar ?? '',
              }
            : emptyValues;

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
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            <Form className='flex flex-col gap-10'>
                <p className='mb-0.5 text-xl'>
                    {isEdit ? 'Edit promotion' : 'Add new promotion'}
                </p>
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
                    <Field name='avatar'>
                        {({ field, form }: FieldProps<string>) => (
                            <LogoUploader
                                square
                                label='Image'
                                placeholder='Upload photo'
                                value={field.value}
                                onChange={(dataUrl) =>
                                    form.setFieldValue('avatar', dataUrl)
                                }
                            />
                        )}
                    </Field>
                </div>
                <Button type='submit' disabled={isPending}>
                    {isEdit ? 'Save changes' : 'Add promotion'}
                </Button>
            </Form>
        </Formik>
    );
}
