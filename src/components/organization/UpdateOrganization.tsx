'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';

export default function UpdateOrganization() {
    const [name, setName] = useState('');
    const router = useRouter();
    const { organization } = useOrganization();

    useEffect(() => {
        if (!organization) {
            return;
        }
        setName(organization.name);
    }, [organization]);

    if (!organization) {
        return null;
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await organization?.update({ name });
            router.push(`/organizations/${organization?.id}`);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Update the current organization</h1>
            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button>Update</button>
            </form>
        </div>
    );
}