import ProductDetailList from '@/components/reusable/ProductDetailList'
import ProductStockDetails from '@/components/reusable/ProductStockDetails'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, PencilIcon } from 'lucide-react'
import React from 'react'

const details = [
    {
        title: 'Name',
        value: 'Product 1'
    },
    {
        title: 'Description',
        value: 'This is a product description'
    },
    {
        title: 'Category',
        value: 'Electronics'
    },
    {
        title: 'Brand',
        value: 'Apple'
    },
    {
        title: 'Price',
        value: '$100'
    },
]

const attributes = [
    {
        title: 'Color',
        value: 'Red'
    },
    {
        title: 'Size',
        value: 'XL'
    },
    {
        title: 'Material',
        value: 'Aluminum'
    },
]

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

const page = ({ params }: { params: { id: string } }) => {
    return (
        <main className="flex flex-col gap-4 px-10">
            <section className='container flex flex-col gap-4'>
                <header className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">Product {params.id}</h1>
                    <div className="flex gap-4">
                        <Button>
                            <span>
                                <PencilIcon className="h-4 w-4" />
                            </span>
                            <h1>Edit</h1>
                        </Button>
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

export default page