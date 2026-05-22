'use client';

import React from 'react';
import CompanyForm from './company-form';
import Modal, { ModalProps } from './modal';

export interface CompanyFormModalProps extends ModalProps {
    /** When provided, the modal edits that company instead of creating one. */
    companyId?: string;
}

export default function CompanyFormModal({
    companyId,
    onClose,
    ...rest
}: CompanyFormModalProps) {
    return (
        <Modal {...rest} onClose={onClose}>
            <CompanyForm companyId={companyId} onSubmit={() => onClose()} />
        </Modal>
    );
}
