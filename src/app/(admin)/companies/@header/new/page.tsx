import React from 'react';
import Header from '../../../../components/header';

export interface PageProps {
    params: { id: string };
}

export default function Page({}: PageProps) {
    return <Header>Add new company</Header>;
}
