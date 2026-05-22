import React from 'react';
import Toolbar from '../../../components/toolbar';
import SearchInput from '../../../components/search-input';
import AddCompanyButton from '../../../components/add-company-button';

// export interface PageProps {}

export default function Page({}) {
    return (
        <Toolbar action={<AddCompanyButton />}>
            <SearchInput />
        </Toolbar>
    );
}
