import { SalesChart } from '@/components/chart/SalesChart'
import OverallComponent from '@/components/reusable/OverallComponent'
import BestSellingProduct from '@/components/reusable/report/BestSellingProduct'
import ReportOverallItem from '@/components/reusable/report/ReportOverallItem'
import { TopSellingTable } from '@/components/table/TopSellingTable'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const data = [
    {
        name: 'Total',
        value: 100,
    },
    {
        name: 'Passed',
        value: 100,
    },
    {
        name: 'Failed',
        value: 100,
    },
    {
        name: 'Failed',
        value: 100,
    },
]

const page = () => {
    return (
        <main className="flex flex-col min-h-screen px-10">
            <div className="flex items-center justify-between gap-4 w-full mb-4">
                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <h1>Overall Report</h1>
                        <div className="flex gap-2">
                            {data.map(({ name, value }) => (
                                <ReportOverallItem
                                    key={name}
                                    item={[{ name, value }]}
                                />
                            ))}
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            {data.map(({ name, value }) => (
                                <ReportOverallItem
                                    key={name}
                                    item={[{ name, value }]}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <BestSellingProduct />
            </div>
            <SalesChart />
            <OverallComponent
                title='Top Selling Product'
            >
            <TopSellingTable />
            </OverallComponent>
        </main>
    )
}

export default page