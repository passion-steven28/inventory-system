import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

type Props = {
    title: string;
    items: {
        title: string;
        value: string;
    }[]
}


export default function OverallCard({ title, items }: Props) {
    return (
        <Card className="w-full p-0">
            <CardHeader>
                <h2 className="text-xl font-bold">{title}</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-between w-full gap-2">
                {items.map((item: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-sm">{item.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
