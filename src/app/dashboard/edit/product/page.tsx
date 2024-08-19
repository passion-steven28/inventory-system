'use client'

import AddProductCategory from '@/components/reusable/product/Add-product-category';
import AddProductDetail from '@/components/reusable/product/Add-product-detail';
import AddProductImage from '@/components/reusable/product/Add-product-image';
import AddProductStatus from '@/components/reusable/product/Add-product-status';
import AddProductStock from '@/components/reusable/product/Add-product-stock';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import React from 'react'
import { api } from '../../../../../convex/_generated/api';
import { useAuth, useUser } from '@clerk/nextjs';
import { useOrganization } from '@clerk/nextjs';

const Page = () => {
    const { organization } = useOrganization();
    const { user } = useUser();
    const create = useMutation(api.product.createProduct);
    const data = useQuery(api.inventory.getOrgTotalInventory, {
        organizationId: organization?.id ?? '',
    })
    console.log(data?.totalQuantity);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const subCategory = formData.get('subcategory') as string;
        const status = formData.get('status') as string;
        const stock = formData.get('stock') as string;
        const buyingPrice = Number(formData.get('buyingPrice')) || 0;
        const sellingPrice = Number(formData.get('sellingPrice')) || 0;
        const quantity = Number(formData.get('quantity')) || 0;
        const minStockThreshold = Number(formData.get('minStockThreshold')) || 0;
        const imageUrl = formData.get('imageUrl') as string;
        console.log(
            'name',name,
            'description',description,
            'category',category,
            'subCategory',subCategory,
            'status',status,
            'stock',stock,
            'buyingPrice',buyingPrice,
            'sellingPrice',sellingPrice,
            'quantity', quantity,
            'minStockThreshold',minStockThreshold,
            'imageUrl',imageUrl,
        )

        if (!organization || !user) return;

        create({
            name,
            description,
            buyingPrice,
            sellingPrice,
            imageUrl: 'imageUrl',
            quantity,
            minStockThreshold,
            status,
            category,
            subCategory,
            organizationId: organization.id,
        }).then((res) => {
            console.log(res);
        })
    }

    return (
        <main className="flex flex-col w-full min-h-screen px-10">
            <form onSubmit={handleSubmit}>
                <header
                    className="mb-4 flex justify-between items-center"
                >
                    <h1
                        className="text-3xl font-bold">
                        Add Product To Inventor
                    </h1>
                    <div className='flex gap-4'>
                        <Button
                            variant={'destructive'}
                            type='submit'
                        >
                            Discard
                        </Button>
                        <Button
                            variant={'default'}
                        >
                            Save Product
                        </Button>
                    </div>
                </header>
                <section className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-4">
                        <AddProductDetail />
                        <AddProductCategory />
                    </div>
                    <div className="flex flex-col gap-4">
                        <AddProductStatus />
                        <AddProductStock />
                        {/* <AddProductImage /> */}
                    </div>
                </section>
            </form>
        </main>
    )
}

export default Page;