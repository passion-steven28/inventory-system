import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    src: string
    alt: string
    width?: number
    height?: number
}

function Logo({ src, alt, width=50, height=50 }: Props) {
    return (
        <Link href="/">
            <Image
                src={`/${src}`}
                alt={alt}
                width={width}
                height={height}
            />
        </Link>
    )
}

export default Logo