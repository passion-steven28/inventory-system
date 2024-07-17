import { DollarSign } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type DashboardCardProps = {
    dashboardCardTitle: string,
    dashboardCardIcon: React.ReactNode,
    dashboardCardValue: string,
    dashboardCardChange: string,
    wrapperTitle?: string,
    children?: React.ReactNode,
}

export default function DashboardCard({
    dashboardCardTitle,
    dashboardCardIcon,
    dashboardCardValue,
    dashboardCardChange,
}: DashboardCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dashboardCardTitle}</CardTitle>
                {dashboardCardIcon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{dashboardCardValue}</div>
                <p className="text-xs text-muted-foreground">{dashboardCardChange}</p>
            </CardContent>
        </Card>
    )
}

export const DashboardCardWrapper = ({
    wrapperTitle,
    children,
}: {
    wrapperTitle: string
    children: React.ReactNode
}) => {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {wrapperTitle}
            </CardHeader>
            <CardContent className="flex items-center justify-between w-full gap-2 overflow-x-scroll">
                {children}
            </CardContent>
        </Card>
    )
}
