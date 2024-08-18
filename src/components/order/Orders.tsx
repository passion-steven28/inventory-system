'use client'

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
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"

type Props = {}


function Orders({ }: Props) {
    const { organization } = useOrganization()
    const orders = useQuery(api.order.getOrdersWithCustomer, {
        organizationId: organization?.id ?? '',
    })
    if (!orders){
        return <div>No orders found</div>
    }
    console.log('orders', orders)

    return (
        <Tabs defaultValue="week">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 text-sm"
                            >
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                                Fulfilled
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Declined
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Refunded
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                    >
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Export</span>
                    </Button>
                </div>
            </div>
            <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>
                            Recent orders from your store.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Type
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.map((order, index) => (
                                    <TableRow key={order._id} className="">
                                        <TableCell>
                                            <div className="font-medium">{order.customer?.name ?? 'N/A'}</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                {order.customer?.email ?? 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            sale
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge className="text-xs" variant="secondary">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(order.orderDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${order.totalPrice}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default Orders
