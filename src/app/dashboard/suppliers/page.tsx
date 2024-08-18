'use client'

import AddSupplier from '@/components/forms/add-supplier'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useConvexAuth, useQuery } from 'convex/react'
import { PlusIcon } from 'lucide-react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { useOrganization } from '@clerk/nextjs'
import { columns } from './columns'
import { DataTable } from './data-table'

const Page = () => {
    const { organization } = useOrganization();
    const data = useQuery(api.supplier.getSuppliers, {
        organizationId: organization?.id ?? '',
    })

    console.log('data', data)

    return (    
        <main className="flex min-h-screen w-full flex-col px-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Suppliers</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            Add Supplier
                            <span className="ml-2">
                                <PlusIcon className="h-4 w-4" />
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[100%] overflow-y-scroll">
                        <AddSupplier />
                    </SheetContent>
                </Sheet>
            </div>
            <section className="p-4">
                <DataTable
                    columns={columns}
                    data={data ?? []}
                />
            </section>
        </main>
    )
}

export default Page