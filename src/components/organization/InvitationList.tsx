"use client"

import { useOrganization } from '@clerk/nextjs';
import { OrganizationCustomRoleKey } from '@clerk/types';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

export const OrgMembersParams = {
    memberships: {
        pageSize: 5,
        keepPreviousData: true,
    },
};

export const OrgInvitationsParams = {
    invitations: {
        pageSize: 5,
        keepPreviousData: true,
    },
};

// Form to invite a new member to the organization.
export const InviteMember = () => {
    const { isLoaded, organization, invitations } = useOrganization(OrgInvitationsParams)
    const [emailAddress, setEmailAddress] = useState("")
    const [disabled, setDisabled] = useState(false)

    if (!isLoaded || !organization) {
        return <>Loading</>
    }

    console.log('invitation data',invitations?.data)

    const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const submittedData = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        ) as {
            email: string | undefined
            role: OrganizationCustomRoleKey | undefined
        }

        if (!submittedData.email || !submittedData.role) {
            return
        }

        setDisabled(true)
        await organization.inviteMember({
            emailAddress: submittedData.email,
            role: submittedData.role,
        })
        await invitations?.revalidate?.()
        setEmailAddress("")
        setDisabled(false)
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                name="email"
                type="text"
                placeholder="Email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
            <label>Role</label>
            <SelectRole fieldName={"role"} />
            <button type="submit" disabled={disabled}>
                Invite
            </button>
        </form>
    )
}

type SelectRoleProps = {
    fieldName?: string
    isDisabled?: boolean
    onChange?: ChangeEventHandler<HTMLSelectElement>
    defaultRole?: string
}

const SelectRole = (props: SelectRoleProps) => {
    const { fieldName, isDisabled = false, onChange, defaultRole } = props
    const { organization } = useOrganization()
    const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([])
    const isPopulated = useRef(false)

    useEffect(() => {
        if (isPopulated.current) return
        organization
            ?.getRoles({
                pageSize: 20,
                initialPage: 1,
            })
            .then((res) => {
                isPopulated.current = true
                setRoles(
                    res.data.map((roles) => roles.key as OrganizationCustomRoleKey)
                )
            })
    }, [organization])

    if (fetchedRoles.length === 0) return null

    return (
        <select
            name={fieldName}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            onChange={onChange}
            defaultValue={defaultRole}
        >
            {fetchedRoles?.map((roleKey) => (
                <option key={roleKey} value={roleKey}>
                    {roleKey}
                </option>
            ))}
        </select>
    )
}

// List of pending invitations to an organization.
export const InvitationList = () => {
    const { isLoaded, invitations, memberships } = useOrganization({
        ...OrgInvitationsParams,
        ...OrgMembersParams,
    });

    if (!isLoaded) {
        return <>Loading</>;
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Invited</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invitations?.data?.map((inv) => (
                        <tr key={inv.id}>
                            <td>{inv.emailAddress}</td>
                            <td>{inv.createdAt.toLocaleDateString()}</td>
                            <td>{inv.role}</td>
                            <td>
                                <button
                                    onClick={async () => {
                                        await inv.revoke();
                                        await Promise.all([
                                            memberships?.revalidate,
                                            invitations?.revalidate,
                                        ]);
                                    }}
                                >
                                    Revoke
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
                    onClick={() => invitations?.fetchPrevious?.()}
                >
                    Previous
                </button>

                <button
                    disabled={!invitations?.hasNextPage || invitations?.isFetching}
                    onClick={() => invitations?.fetchNext?.()}
                >
                    Next
                </button>
            </div>
        </>
    );
};