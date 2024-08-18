'use client'
import React from 'react'
import { Separator } from '../ui/separator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Copy, CreditCard, MoreVertical, Truck } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'
import { useQuery } from 'convex/react'
import { useOrganization } from '@clerk/nextjs'
import { getLastOrders } from '../../../convex/order'
import { api } from '../../../convex/_generated/api'

type Props = {}

function Invoice({ }: Props) {
    const {organization} = useOrganization()
    const lastOrder = useQuery(api.order.getLastOrders, {
        organizationId: organization?.id ?? '',
    })
    const getOrdersInSpecDuration = useQuery(api.order.getOrdersInSpecDuration, {
        organizationId: organization?.id ?? '',
        duration: 'last7days',
    })
    console.log('getOrdersInSpecDuration', getOrdersInSpecDuration)

    return (
        <Card
            className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
        >
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-md">
                        OrderId: {lastOrder?.orders._id.slice(0, 5)}...
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >  
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy Order ID</span>
                        </Button>
                    </CardTitle>
                    <CardDescription>
                        Date: {new Date(lastOrder?.orders.orderDate || '').toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                            Track Order
                        </span>
                    </Button>
                    {/* <DropdownMenu>
                        <DropdownMenuSubTrigger asChild>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                                <MoreVertical className="h-3.5 w-3.5" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Trash</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                        {lastOrder?.products.map((product, index) => (
                            <li className="flex items-center justify-between" key={index}>
                                <span className="text-muted-foreground">
                                    {product?.name} x <span>{product?.quantity}</span>
                                </span>
                                <span>$ {product?.sellingPrice}</span>
                            </li>
                        ))}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${lastOrder?.orders?.totalPrice}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>$0.00</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>$0.00</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>${lastOrder?.orders?.totalPrice}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <div className="font-semibold">Shipping Information</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>Liam Johnson</span>
                            <span>1234 Main St.</span>
                            <span>Anytown, CA 12345</span>
                        </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                        <div className="font-semibold">Billing Information</div>
                        <div className="text-muted-foreground">
                            Same as shipping address
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Customer</dt>
                            <dd>{lastOrder?.customer?.name}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                                <a href="mailto:">{lastOrder?.customer?.email}</a>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>
                                <a href="tel:">+255 {lastOrder?.customer?.phone}</a>
                            </dd>
                        </div>
                    </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dt className="text-muted-foreground">cash</dt>
                    {/* <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-1 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                Visa
                            </dt>
                            <dd>**** **** **** 4532</dd>
                        </div>
                    </dl> */}
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Previous Order</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Next Order</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    )
}

export default Invoice
