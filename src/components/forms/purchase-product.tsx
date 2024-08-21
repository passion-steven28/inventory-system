"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useOrganization, useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { toast } from "sonner"


const formSchema = z.object({
    productId: z.string(),
    sellerId: z.string(),
    buyingPrice: z.string().min(1, {
        message: "Buying price must be at least 1 shilling.",
    }),
    sellingPrice: z.string().min(1, {
        message: "Selling price must be at least 1 shilling.",
    }),
    openingStock: z.string(),
    currentStock: z.string().optional(),
    minStockThreshold: z.string(),
    status: z.string(),
})

type Props = {}

export default function PurchaseProduct({ }: Props) {
    const { organization } = useOrganization();


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const createInventory = useMutation(api.inventory.createInventory);
    const getSuppliers = useQuery(api.supplier.getSuppliers, {
        organizationId: organization?.id ?? '',
    })
    const getProducts = useQuery(api.product.getProducts, {
        organizationId: organization?.id ?? '',
    })


    // 2. Define a submit handler.
    function OnSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        const productId = values.productId as Id<'product'>;
        const sellerId = values.sellerId as Id<'supplier'>;
        const buyingPrice = Number(values.buyingPrice);
        const sellingPrice = Number(values.sellingPrice);
        const openStock = Number(values.openingStock);
        const minStockThreshold = Number(values.minStockThreshold);
        const status = values.status;

        createInventory({
            organizationId: organization?.id ?? '',
            productId,
            supplierId: sellerId,
            buyingPrice,
            sellingPrice,
            openStock,
            currentStock : openStock,
            minStockThreshold,
            status,
        }).then((res) => {
            toast.success("Inventory created successfully");
        })

        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8 mt-4">
                <section className="flex flex-col gap-4">
                    <InputCardComponent title="Select Product">
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>products</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger id="productId" aria-label="Select product">
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getProducts?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item._id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </InputCardComponent>
                    <InputCardComponent title="Select Supplier">
                        <FormField
                            control={form.control}
                            name="sellerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product supplier</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger id="sellerId" aria-label="Select seller">
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getSuppliers?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item._id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </InputCardComponent>
                    <InputCardComponent title="Select Status">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger id="sellerId" aria-label="Select status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="inStock">inStock</SelectItem>
                                                <SelectItem value="outOfStock">outOfStock</SelectItem>
                                                <SelectItem value="draft">draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </InputCardComponent>
                    <InputCardComponent title="Product stock">
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="openingStock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>stock quantity</FormLabel>
                                        <FormControl>
                                            <Input placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="minStockThreshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min stockThreshold</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="buyingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buying price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1500" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </InputCardComponent>
                    <Button type="submit">Submit</Button>
                </section>
            </form>
        </Form>
    )
}

type CardProps = {
    title: string
    children: React.ReactNode
}
const InputCardComponent = ({ title, children, }: CardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}
