import React from 'react'
import CreateOrganization from '@/components/organization/CreateOrganization';
import { CustomOrganizationSwitcher } from '@/components/organization/CustomOrganizationSwitcher';


const createOrganizationPage = () => {
    return (
        <div>
            <CreateOrganization />
            <CustomOrganizationSwitcher />
        </div>
    )
}

export default createOrganizationPage;