import DataTable from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
    return (
        <main className="flex min-h-screen w-full flex-col px-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Suppliers</h1>
                <Button>Create new supplier</Button>
            </div>
            <section className="p-4">
                <DataTable />
            </section>
        </main>
    )
}

export default page