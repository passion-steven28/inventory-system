"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, Controller } from "react-hook-form"
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
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { useOrganization } from "@clerk/nextjs"
import { api } from "../../../convex/_generated/api"
import { toast } from "sonner"
import { orderColumns } from "@tanstack/react-table"
import { createOrder } from "../../../convex/order"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { useEffect, useState } from "react"
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/extension/multi-select-component"
import { Label } from "../ui/label"
import { Trash2Icon, TrashIcon } from "lucide-react"
import test from "node:test"
import { Id } from "../../../convex/_generated/dataModel"


const formSchema = z.object({
    customerId: z.string().min(2).max(50),
    status: z.string().min(2).max(50),
    items: z.array(z.object({
        productId: z.string().min(2).max(50),
        quantity: z.number().min(1).max(100),
        price: z.number().min(1).max(100),
    })),
    inputs: z.array(z.object({
        value: z.string().min(2).max(50),
    })).optional(),
})

const AddOrder = () => {
    const { isAuthenticated } = useConvexAuth()
    const { organization } = useOrganization();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { },
    })

    const { control } = useForm();
    const { handleSubmit } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const getProducts: Option[] = useQuery(api.product.getProducts, {
        organizationId: organization?.id ?? '',
    })?.map((item) => ({
        label: item.name,
        value: item._id,
    })) ?? [];
    const getCustomers = useQuery(api.customer.getCustomers, {
        organizationId: organization?.id ?? '',
    });
    const createOrder = useMutation(api.order.createOrder);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!organization || !isAuthenticated) return;
        createOrder({
            organizationId: organization.id,
            customerId: values.customerId as Id<"customer">,
            status: values.status,
            orderItems: values.items.map((item) => ({
                productId: item.productId as Id<"product">,
                quantity: item.quantity,
                price: item.price,
            })) ?? [],
        }).then((res) => {
            if (res) {
                toast.success("Order created successfully");
            }
        });
        console.log('values', values)
        form.reset();
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="customerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>select a customer</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {getCustomers?.map((item) => (
                                            <SelectItem
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col items-center justify-center mt-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-2">
                                <Label>Product {index + 1}</Label>
                                <div className="flex flex-col gap-2">
                                    <Controller
                                        name={`items.${index}.productId`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getProducts.map((item) => (
                                                        <SelectItem
                                                            key={item.value ?? ''}
                                                            value={item.value ?? 'test'}
                                                        >
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                        )}
                                    />
                                    {form.formState.errors.items?.[index]?.productId && (
                                        <p className="text-red-500">
                                            {form.formState.errors.items[index].productId.message}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Quantity"
                                            {...form.register(`items.${index}.quantity`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {form.formState.errors.items?.[index]?.quantity && (
                                            <p className="text-red-500">
                                                {form.formState.errors.items[index].quantity.message}
                                            </p>
                                        )}
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price"
                                            {...form.register(`items.${index}.price`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {form.formState.errors.items?.[index]?.price && (
                                            <p className="text-red-500">
                                                {form.formState.errors.items[index].price.message}
                                            </p>
                                        )}
                                        <Button
                                            type="button"
                                            onClick={() => remove(index)}
                                            variant="destructive"
                                            size={'icon'}
                                            className="p-2"
                                        >
                                            <Trash2Icon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={() => append({ productId: "", quantity: 1, price: 0.0 })}
                            className="w-full my-2"
                        >
                            Add Product
                        </Button>
                    </div>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>select a order status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a order status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pending">pending</SelectItem>
                                        <SelectItem value="shipped">shipped</SelectItem>
                                        <SelectItem value="delivered">delivered</SelectItem>
                                        <SelectItem value="cancelled">cancelled</SelectItem>
                                        <SelectItem value="returned">returned</SelectItem>
                                        <SelectItem value="refunded">refunded</SelectItem>
                                        <SelectItem value="completed">completed</SelectItem>
                                        <SelectItem value="expired">expired</SelectItem>
                                        <SelectItem value="failed">failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        onClick={()=> console.log('cliked')}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AddOrder