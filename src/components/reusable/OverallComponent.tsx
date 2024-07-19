import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'

type Props = {
    title: string
    children: React.ReactNode
}

function OverallComponent({title, children}: Props) {
    return (
        <div className="flex flex-col gap-4 container">
            <div>
                <h2>Overall { title }</h2>
            </div>
            <div className="flex gap-2">
                { children }
            </div>
        </div>
    )
}

export default OverallComponent