'use client'

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AddOrder from '../forms/add-order'
import { useOrganization } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import useShortNumber from '@/hooks/shortNumbers'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react'
import AddCustomer from '../forms/add-customer'

type Props = {}

function Dashboard({}: Props) {
    const { organization } = useOrganization()
    const { formattedNumber, shortenNumber } = useShortNumber();
    const totalPriceInLast7Days = useQuery(api.order.getOrdersInSpecDuration, {
        organizationId: organization?.id ?? '',
        duration: 'last7days',
    })

    useEffect(() => {
        shortenNumber(totalPriceInLast7Days?.reduce((acc, order) => acc + (order.totalPrice ?? 0), 0) ?? 0)
    }, [shortenNumber, totalPriceInLast7Days]);
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
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        customer <PlusIcon className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Customer</DialogTitle>
                                        <AddCustomer />
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            <AddOrder />
                        </SheetContent>
                    </Sheet>
                </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                    <CardDescription>This Week</CardDescription>
                    <CardTitle className="text-2xl">{formattedNumber} TZS</CardTitle>
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
                    <CardTitle className="text-2xl">{formattedNumber} TZS</CardTitle>
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