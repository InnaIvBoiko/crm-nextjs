import React from 'react';
import clsx from 'clsx';
import { CompanyStatus } from '@/src/lib/api';

export interface StatusLabelProps {
    status: CompanyStatus;
    disabled?: boolean;
    styled?: boolean;
}

const labelByStatus = {
    [CompanyStatus.Active]: 'Active',
    [CompanyStatus.NotActive]: 'Not Active',
    [CompanyStatus.Pending]: 'Pending',
    [CompanyStatus.Suspended]: 'Suspended',
};

export default function StatusLabel({
    status,
    disabled,
    styled = true,
}: StatusLabelProps) {
    if (!styled) {
        return <>{labelByStatus[status]}</>;
    }

    return (
        <div
            className={clsx(
                'inline-flex items-center gap-1 py-1 px-3.5 rounded-3xl text-cm font-medium',
                status === CompanyStatus.Active &&
                    'text-green-700 bg-green-100',
                status === CompanyStatus.NotActive && 'text-red-700 bg-red-100',
                status === CompanyStatus.Pending &&
                    'text-orange-700 bg-orange-100',
                status === CompanyStatus.Suspended &&
                    'text-blue-700 bg-blue-100',
                { 'opacity-75 cursor-not-allowed': disabled },
            )}
        >
            <div className='w-1 h-1 rounded-full bg-current' />
            {labelByStatus[status]}
        </div>
    );
}
