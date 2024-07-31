"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormInput from "./form-input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useState } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }).max(100, {
        message: "Title must be at most 100 characters.",
    }),
    description: z.string().optional(),
    category: z.string(),
    subCategory: z.string(),
    status: z.string(),
    quantity: z.number(),
    minStockThreshold: z.number(),
    buyingPrice: z.number().min(1, {
        message: "Buying price must be at least 1 shilling.",
    }),
    sellingPrice: z.number().min(1, {
        message: "Selling price must be at least 1 shilling.",
    }),
})

type Props = {}

export default function AddProduct({ }: Props) {
    const { organization } = useOrganization();
    const { user } = useUser();
    const createProduct = useMutation(api.product.createProduct);
    const products = useQuery(api.inventory.getOrgTotalInventory, {
        organizationId: organization?.id ?? '',
    })

    const category = useQuery(api.category.getCategories, {
        organizationId: organization?.id ?? '',
    })
    const subcategory = useQuery(api.subCategory.getSubCategories, {
        organizationId: organization?.id ?? '',
    })
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    // 2. Define a submit handler.
    function OnSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log('values', values)

        // Apply the suggested edit
        const buyingPrice = Number(form.getValues('buyingPrice')) || 0;
        const sellingPrice = Number(form.getValues('sellingPrice')) || 0;

        // You can now use buyingPrice and sellingPrice as needed
        console.log('Buying Price:', buyingPrice);
        console.log('Selling Price:', sellingPrice);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8 mt-4">
                <section className="flex flex-col gap-4">
                    <InputCardComponent title="Product details">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dell latitude" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="New Dell Latitude model" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </InputCardComponent>
                    <InputCardComponent title="Product category">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product category</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue="inStock"
                                            {...field}>
                                            <SelectTrigger id="category" aria-label="Select category">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {category?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item.name}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product sub category</FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger id="subCategory" aria-label="Select sub category">
                                                <SelectValue placeholder="Select sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subcategory?.map((item) => (
                                                    <SelectItem key={item._id} value={item.name}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </InputCardComponent>
                    <InputCardComponent title="Product status">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product status</FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger id="status" aria-label="Select status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="inStock">inStock</SelectItem>
                                                <SelectItem value="lowStock">lowStock</SelectItem>
                                                <SelectItem value="outOfStock">outOfStock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </InputCardComponent>
                    <InputCardComponent title="Product stock">
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>stock quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} />
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
const InputCardComponent = ({ title, children }: CardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}