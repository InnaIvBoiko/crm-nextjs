'use client';

import React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import Button from './button';
import InputField from './input-field';
import LogoUploader from './logo-uploader';
import {
    Company,
    CompanyStatus,
    createCompany,
    getCategories,
    getCompany,
    getCountries,
    updateCompany,
} from '@/src/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StatusLabel from './status-label';

export type CompanyFieldValues = {
    title: string;
    status: CompanyStatus;
    joinedDate: string;
    categoryId: string;
    countryId: string;
    description: string;
    avatar: string;
};

const emptyValues: CompanyFieldValues = {
    title: '',
    status: CompanyStatus.Active,
    joinedDate: '',
    categoryId: '',
    countryId: '',
    description: '',
    avatar: '',
};

export interface CompanyFormProps {
    /** When provided, the form edits that company instead of creating one. */
    companyId?: string;
    onSubmit?: (values: CompanyFieldValues) => void | Promise<void>;
}

export default function CompanyForm({ companyId, onSubmit }: CompanyFormProps) {
    const isEdit = Boolean(companyId);
    const queryClient = useQueryClient();

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 10 * 1000,
    });

    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        staleTime: 10 * 1000,
    });

    const { data: company } = useQuery({
        queryKey: ['companies', companyId],
        queryFn: () => getCompany(companyId as string),
        staleTime: 10 * 1000,
        enabled: isEdit,
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<Company, 'id' | 'hasPromotions'>) =>
            createCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: Omit<Company, 'id' | 'hasPromotions'>) =>
            updateCompany(companyId as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            queryClient.invalidateQueries({
                queryKey: ['companies', companyId],
            });
        },
    });

    const { mutateAsync, isPending } = isEdit ? updateMutation : createMutation;

    const initialValues: CompanyFieldValues =
        isEdit && company
            ? {
                  title: company.title,
                  status: company.status,
                  joinedDate: company.joinedDate,
                  categoryId: company.categoryId,
                  countryId: company.countryId,
                  description: company.description,
                  avatar: company.avatar ?? '',
              }
            : emptyValues;

    const handleSubmit = async (values: CompanyFieldValues) => {
        await mutateAsync({
            ...values,
            categoryTitle:
                categories?.find(({ id }) => id === values.categoryId)?.title ??
                '',
            countryTitle:
                countries?.find(({ id }) => id === values.countryId)?.title ??
                '',
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
                    {isEdit ? 'Edit company' : 'Add new company'}
                </p>
                <div className='flex gap-6'>
                    <div className='flex flex-col flex-1 gap-5'>
                        <Field name='avatar'>
                            {({ field, form }: FieldProps<string>) => (
                                <LogoUploader
                                    label='Logo'
                                    placeholder='Upload photo'
                                    value={field.value}
                                    onChange={(dataUrl) =>
                                        form.setFieldValue('avatar', dataUrl)
                                    }
                                />
                            )}
                        </Field>
                        <InputField
                            required
                            label='Status'
                            placeholder='Status'
                            name='status'
                            as='select'
                        >
                            {(
                                Object.values(CompanyStatus) as CompanyStatus[]
                            ).map((status) => (
                                <option key={status} value={status}>
                                    <StatusLabel
                                        status={status}
                                        styled={false}
                                    />
                                </option>
                            ))}
                        </InputField>
                        <InputField
                            required
                            label='Country'
                            placeholder='Country'
                            name='countryId'
                            as='select'
                        >
                            {countries?.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.title}
                                </option>
                            ))}
                        </InputField>
                    </div>
                    <div className='flex flex-col flex-1 gap-5'>
                        <InputField
                            required
                            label='Name'
                            placeholder='Name'
                            name='title'
                        />
                        <InputField
                            required
                            label='Category'
                            placeholder='Category'
                            name='categoryId'
                            as='select'
                        >
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </InputField>
                        <InputField
                            required
                            label='Joined date'
                            type='date'
                            name='joinedDate'
                        />
                        <InputField
                            required
                            label='Description'
                            placeholder='Description'
                            name='description'
                        />
                    </div>
                </div>
                <Button type='submit' disabled={isPending}>
                    {isEdit ? 'Save changes' : 'Add company'}
                </Button>
            </Form>
        </Formik>
    );
}
