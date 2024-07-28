'use client'

import OverallCard from '@/components/reusable/OverallCard';
import OverallComponent from '@/components/reusable/OverallComponent'
import React from 'react'
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';

type overallItem = {
    title: string;
    items: {
        title: string;
        value: string;
    }[]
}

const overallItems: overallItem[] = [
    {
        title: 'Total',
        items: [
            {
                title: 'Total',
                value: '$100,000'
            },
            {
                title: 'Total',
                value: '$200,000'
            }
        ]
    },
    {
        title: 'Total',
        items: [
            {
                title: 'Total',
                value: '$200,000'
            }
        ]
    },
    {
        title: 'Total',
        items: [
            {
                title: 'Total',
                value: '$200,000'
            }
        ]
    },
    {
        title: 'Total',
        items: [
            {
                title: 'Total',
                value: '$200,000'
            }
        ]
    },
    {
        title: 'Total',
        items: [
            {
                title: 'Total',
                value: '$200,000'
            }
        ]
    },
]

// function getData(): Promise<Payment[]> {
//     // Fetch data from your API here.
//     return [
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         // ...
//     ]
// }

const Page = () => {
    const organization = useOrganization();

    const data = useQuery(api.product.getProducts, {
        organizationId: organization?.organization?.id ?? '',
    })
    const {_id, _creationTime, name, description, price, imageUrl, quantity, categoryId, subCategoryId, status, organizationId, userId} = data?.[0] ?? {};

    console.log(data?.map((item) => item));
    const dataId = data?.map((item) => item.price);

    return (
        <main className="flex flex-col gap-4 px-10">
            <div className="md:col-start-2 md:col-end-12">
                <OverallComponent
                    title="Products"
                >
                    {overallItems.map((item: overallItem, index: number) => (
                        <OverallCard
                            key={index}
                            title={item.title}
                            items={item.items}
                        />
                    ))}
                </OverallComponent>
            </div>
            <div className="md:col-start-2 md:col-end-12 flex justify-end">
                <Link
                    href="/dashboard/edit/product"
                >
                    <Button>
                            Add Order
                            <span className="ml-2">
                                <PlusIcon className="h-4 w-4" />
                            </span>
                    </Button>
                </Link>
            </div>
            <section className="md:col-start-2 md:col-end-12">
                <DataTable
                    columns={columns}
                    data={data ?? []}
                />
            </section>
        </main>
    )
}

export default Page
