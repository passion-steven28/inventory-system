"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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

const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    imageUrl: z.string().optional(),
})


const AddCustomer = () => {
    const { isAuthenticated } = useConvexAuth()
    const { organization } = useOrganization();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            description: "",
            imageUrl: "",
        },
    })

    const { control } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const getProducts = useQuery(api.product.getProducts, {
        organizationId: organization?.id ?? '',
    })?.map((item) => ({
        label: item.productName,
        value: item._id,
    })) ?? [];
    const getCustomers = useQuery(api.customer.getCustomers, {
        organizationId: organization?.id ?? '',
    });
    const createSupplier = useMutation(api.supplier.createSupplier);

    const createCustomer = useMutation(api.customer.createCustomer);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!organization || !isAuthenticated) return;
        createCustomer({
            organizationId: organization.id,
            customerName: values.username,
            email: values.email,
            phone: values.phone,
            description: values.description,
        }).then((res) => {
            console.log(res);
            toast("New customer has been created.");
        })
        form.reset();
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2"></div>))}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AddCustomer
