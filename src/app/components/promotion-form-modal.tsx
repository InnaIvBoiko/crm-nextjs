'use client';

import React from 'react';
import PromotionForm from './promotion-form';
import Modal, { ModalProps } from './modal';

export interface PromotionFormModalProps extends ModalProps {
    companyId: string;
    /** When provided, the modal edits that promotion instead of creating one. */
    promotionId?: string;
}

export default function PromotionFormModal({
    companyId,
    promotionId,
    onClose,
    ...rest
}: PromotionFormModalProps) {
    return (
        <Modal {...rest} onClose={onClose}>
            <PromotionForm
                companyId={companyId}
                promotionId={promotionId}
                onSubmit={() => onClose()}
            />
        </Modal>
    );
}
