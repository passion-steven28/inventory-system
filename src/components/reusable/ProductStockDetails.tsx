import Image from 'next/image'
import React from 'react'

type Props = {
    src: string;
    alt: string;
    items: {
        title: string;
        value: string | number;
    }[]
}

function ProductStockDetails({src, alt, items}: Props) {
    return (
        <div>
            <div className="p-4 relative w-[20rem] h-[20rem]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className='size-full object-cover object-center rounded-xl border-2 border-black/10 shadow-md shadow-primary'
                />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className="text-lg font-bold">Product stock details</h1>
                <ul className="list-disc list-inside space-y-2">
                    {items.map((item: any, index: number) => (
                        <li
                            key={index}
                            className="flex items-center justify-between gap-2 group"
                        >
                            <h2>{item.title}</h2>
                            <p className="group-hover:underline">{item.value}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ProductStockDetails