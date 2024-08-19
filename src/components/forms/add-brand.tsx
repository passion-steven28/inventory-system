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
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }).max(100, {
        message: "Name must be at most 100 characters.",
    }),
})

export default function AddBrand() { 
    const { organization } = useOrganization();
    const addBrand = useMutation(api.brand.createBrand);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    // 2. Define a submit handler.
    function OnSubmit(values: z.infer<typeof formSchema>) {
        const name = values.name;

        addBrand({
            name,
            organizationId: organization?.id ?? '',
        }).then((res) => {
            toast.success("Brand created successfully");
        })
        form.reset()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8 mt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product category</FormLabel>
                            <FormControl>
                                <Input placeholder="dell" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}