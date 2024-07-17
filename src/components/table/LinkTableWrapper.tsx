import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import Link from 'next/link'

type Props = {
    title: string
    url: string
    children: React.ReactNode
}

function LinkTableWrapper({title, url, children}: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-xl font-medium leading-6 text-white">
                    {title}
                </h3>
                <div className="mt-2">
                    <Link
                        href={url}
                        className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        View all
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default LinkTableWrapper