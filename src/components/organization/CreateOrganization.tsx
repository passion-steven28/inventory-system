'use client';

import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";


export default function CreateOrganization() {
    const router = useRouter();
    const { createOrganization } = useOrganizationList();
    const [organizationName, setOrganizationName] = useState("");
    const { isLoaded, setActive, userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    if (!isLoaded) {
        return <p>Loading</p>;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (createOrganization) {
            const newOrganization = await createOrganization({ name: organizationName });
            setOrganizationName("");
            if (newOrganization) {
                setActive({ organization: newOrganization.id });
                router.push("/dashboard");
            }
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-full max-w-lg gap-4"
            >
            <Label>Organization name</Label>
                <Input
                    type="text"
                    name="organizationName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.currentTarget.value)}
                />
                <Button type="submit">Create organization</Button>
            </form>
        </div>
    );
}