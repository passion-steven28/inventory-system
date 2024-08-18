'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    File,
    Home,
    LineChart,
    ListFilter,
    MoreVertical,
    Package,
    Package2,
    PanelLeft,
    Search,
    Settings,
    ShoppingCart,
    Truck,
    Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import AddOrder from '../forms/add-order'
import { useOrganization } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

type Props = {}

function Dashboard({ }: Props) {
    const { organization } = useOrganization()
    const totalPriceInLast7Days = useQuery(api.order.getOrdersInSpecDuration, {
        organizationId: organization?.id ?? '',
        duration: 'last7days',
    })
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
            >
                <CardHeader className="pb-3">
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                        Introducing Our Dynamic Orders Dashboard for Seamless
                        Management and Insightful Analysis.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button>Create New Order</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <AddOrder />
                        </SheetContent>
                    </Sheet>
                </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                    <CardDescription>This Week</CardDescription>
                    <CardTitle className="text-4xl">${totalPriceInLast7Days?.reduce((acc, order) => acc + order.totalPrice, 0)}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        +25% from last week
                    </div>
                </CardContent>
                <CardFooter>
                    <Progress value={35} aria-label="25% increase" />
                </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                    <CardDescription>This Month</CardDescription>
                    <CardTitle className="text-4xl">${totalPriceInLast7Days?.reduce((acc, order) => acc + order.totalPrice, 0)}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        +10% from last month
                    </div>
                </CardContent>
                <CardFooter>
                    <Progress value={12} aria-label="12% increase" />
                </CardFooter>
            </Card>
        </div>
    )
}

export default Dashboard