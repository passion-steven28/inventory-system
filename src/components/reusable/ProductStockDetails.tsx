import Image from 'next/image'
import React from 'react'

type Props = {
    src: string;
    alt: string;
}

function ProductStockDetails({src, alt}: Props) {
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
        </div>
    )
}

export default ProductStockDetails