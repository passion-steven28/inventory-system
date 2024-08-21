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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { Id } from '../../../../convex/_generated/dataModel';
import AddProduct from '@/components/forms/add-product';
import AddBrand from '@/components/forms/add-brand';
import AddCategory from '@/components/forms/add-category';
import AddTags from '@/components/forms/add-tags';
import PurchaseProduct from '@/components/forms/purchase-product';
import AddSupplier from '@/components/forms/add-supplier';

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

    const getAllInventory = useQuery(api.inventory.getAllInventory, {
        organizationId: organization?.id ?? '',
    });

    console.log(getAllInventory)

    let data: any[] = []; // Ensure data is typed as an array of any

    if (getAllInventory && getAllInventory.products) {
        data.push(...getAllInventory.products); // Spread operator to concatenate arrays
    }

    console.log(data);

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <div>You are not authenticated</div>
    }

    return (
        <main className="flex flex-col gap-4 px-10">
            <div className="md:col-start-2 md:col-end-12 flex justify-end">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            purchase product
                            <span className="ml-2">
                                <PlusIcon className="h-4 w-4" />
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[100%] overflow-y-scroll">
                        <div className="flex gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        Product <PlusIcon className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[100%] overflow-y-scroll">
                                    <div className="flex gap-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    category <PlusIcon className="h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Category</DialogTitle>
                                                    <AddCategory />
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    brand <PlusIcon className="h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Brand</DialogTitle>
                                                    <AddBrand />
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    brand <PlusIcon className="h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Tags</DialogTitle>
                                                    <AddTags />
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <AddProduct />
                                </SheetContent>
                            </Sheet>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        Supplier <PlusIcon className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Supplier</DialogTitle>
                                    </DialogHeader>
                                    <AddSupplier />
                                </DialogContent>
                            </Dialog>
                        </div>
                        <PurchaseProduct />
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
