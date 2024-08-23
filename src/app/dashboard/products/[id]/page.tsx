'use client'

import ProductDetailList from '@/components/reusable/ProductDetailList'
import ProductStockDetails from '@/components/reusable/ProductStockDetails'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useOrganization } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { Download, PencilIcon } from 'lucide-react'
import React from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'


type ProductDetail = {
    title: string;
    value: string;
}[]

const stockDetails = [
    {
        title: 'Opening stock',
        value: '200'
    },
    {
        title: 'Remaining stock',
        value: '100'
    },
    {
        title: 'Out of stock',
        value: '0'
    },
]

const Page = ({ params }: { params: { id: string } }) => {
    const { organization } = useOrganization();
    console.log(params.id);
    const product = useQuery(api.product.getProduct, {
        id: params.id as Id<'product'>,
        organizationId: organization?.id ?? '',
    });

    const details = [
        {
            title: 'Name',
            value: product?.product.productName ?? ''
        },
        {
            title: 'Description',
            value: product?.product.description ?? ''
        },
        {
            title: 'Category',
            value: product?.product.category ?? ''
        },
        {
            title: 'Brand',
            value: 'brand'
        },
    ]

    const attributes = product?.productProperties?.map((property) => ({
        title: property?.propertyName ?? '',
        value: property?.value ?? '',
    })) ?? [];

    return (
        <main className="flex flex-col gap-4 px-10">
            <section className='container flex flex-col gap-4'>
                <header className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">Product: {product?.product.productName}</h1>
                    <div className="flex gap-4">
                        <Button>
                            <span>
                                <Download className="h-4 w-4" />
                            </span>
                            <h1>Export</h1>
                        </Button>
                    </div>
                </header>
                <Separator />
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <div className="flex flex-col gap-4 flex-1">
                        <ProductDetailList title="Details" items={details} />
                        <ProductDetailList title="Attributes" items={attributes} />
                    </div>
                    <div>
                        <ProductStockDetails
                            src="/images/ipad.jpg"
                            alt="Product stock details"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Page
