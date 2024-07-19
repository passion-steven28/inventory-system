import AddProductCategory from '@/components/reusable/product/Add-product-category';
import AddProductDetail from '@/components/reusable/product/Add-product-detail';
import AddProductImage from '@/components/reusable/product/Add-product-image';
import AddProductStatus from '@/components/reusable/product/Add-product-status';
import AddProductStock from '@/components/reusable/product/Add-product-stock';
import { Button } from '@/components/ui/button';
import React from 'react'

const page = () => {
    return (
        <main className="flex flex-col w-full min-h-screen px-10">
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
                    <AddProductStock />
                    <AddProductCategory />
                </div>
                <div className="flex flex-col gap-4">
                    <AddProductStatus />
                    <AddProductImage />
                </div>
            </section>
        </main>
    )
}

export default page;