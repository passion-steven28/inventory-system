import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    columnStart: number,
    columnEnd: number,
    rowStart?: number,
    rowEnd?: number,
    children: React.ReactNode
}

export default function Grids({ columnStart, columnEnd, rowStart, rowEnd, children }: Props) {

    return (
        <div className={`col-start-${columnStart} col-end-${columnEnd} row-start-${rowStart} row-end-${rowEnd}`}>
            {children}
        </div>
    )
}
