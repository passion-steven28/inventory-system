import React from 'react'

type Props = {
    title: string;
    items: {
        title: string;
        value: string | number;
    }[]
}

export default function ProductDetailList({ title, items }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">{title}</h1>
            <ul className="list-disc list-inside space-y-2 w-1/2">
                {items.map((item: any, index: number) => (
                    <li
                        key={index}
                        className="flex items-center justify-between group"
                    >
                        <h2 className="text-sm font-bold">{item.title}</h2>
                        <p className="text-sm group-hover:underline transition-all ease-in-out duration-300">{item.value}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}