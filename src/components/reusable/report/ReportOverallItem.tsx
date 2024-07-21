import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react'

type Props = {
    item: {
        name: string,
        value: number,
    }[]
}

function ReportOverallItem({ item }: Props) {
    return (
        <Card>
                <div className="flex flex-row items-center justify-center p-4">
                    {item.map(({ name, value }) => (
                        <div
                            key={name}
                            className="flex flex-col items-center justify-center space-x-2"
                        >
                            <div className="text-sm font-medium">{value}</div>
                            <div className="text-sm font-medium">{name}</div>
                        </div>
                    ))}
                </div>
        </Card>
    )
}

export default ReportOverallItem;