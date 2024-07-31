'use client'

import OverallCard from '@/components/reusable/OverallCard';
import OverallComponent from '@/components/reusable/OverallComponent'
import React from 'react'
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { Id } from '../../../../convex/_generated/dataModel';
import AddProduct from '@/components/forms/add-product';

type overallItem = {
    title: string;
    items: {
        value: string;
        title: string;
    }[]
}


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
    const { isAuthenticated, isLoading } = useConvexAuth()
    const { organization } = useOrganization();
    const totalProductInInventory = useQuery(api.inventory.getOrgTotalInventory, {
        organizationId: organization?.id ?? '',
    })

    const data = useQuery(api.product.getProducts, {
        organizationId: organization?.id ?? '',
    })
    const getAllProducts = useQuery(api.product.getTotalProducts, {
        organizationId: organization?.id ?? '',
    })
    const getAllCategories = useQuery(api.category.getTotalCategories, {
        organizationId: organization?.id ?? '',
    })
    const getAllSubCategories = useQuery(api.subCategory.getTotalSubCategories, {
        organizationId: organization?.id ?? '',
    })
    const getOrgTotalInventory = useQuery(api.inventory.getOrgTotalInventory, {
        organizationId: organization?.id ?? '',
    })
    const getLowestProductInInventory = useQuery(api.inventory.getLowStockProducts, {
        organizationId: organization?.id ?? '',
    })
    console.log('getLowestProductInInventory', getLowestProductInInventory)
    const dataId = data?.map((item) => item.sellingPrice);
    const overallItems: overallItem[] = [
        {
            title: 'products',
            items: [
                {
                    value: (totalProductInInventory?.totalQuantity ?? 0).toString(),
                    title: 'in inventory',
                }
            ]
        },
        {
            title: 'categories',
            items: [
                {
                    value: getAllCategories?.toString() ?? '0',
                    title: 'main',
                },
                {
                    value: getAllSubCategories?.toString() ?? '0',
                    title: 'sub',
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
            title: 'Row in stock',
            items: [
                {
                    title: 'Total',
                    value: '$200,000'
                }
            ]
        },
        {
            title: 'Out in stock',
            items: [
                {
                    title: 'Total',
                    value: '$200,000'
                }
            ]
        },
    ]

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <div>You are not authenticated</div>
    }

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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            Add Product
                            <span className="ml-2">
                                <PlusIcon className="h-4 w-4" />
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[100%] overflow-y-scroll">
                        <AddProduct />
                    </SheetContent>
                </Sheet>
                {/* 
                <Link
                    href="/dashboard/edit/product"
                >
                    <Button>
                            Add Order
                            <span className="ml-2">
                                <PlusIcon className="h-4 w-4" />
                            </span>
                    </Button>
                </Link> */}
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
