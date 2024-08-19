"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
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
import { Label } from "../ui/label"
import { TrashIcon } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }).max(100, {
        message: "Name must be at most 100 characters.",
    }),
    subCategory: z.array(z.string()),
})

export default function AddCategory() {
    const { organization } = useOrganization();
    const addCategory = useMutation(api.category.createCategory);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const { control } = useForm();
    const { handleSubmit } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subCategory",
    });

    // 2. Define a submit handler.
    function OnSubmit(values: z.infer<typeof formSchema>) {
        const name = values.name;
        const subCategory = values.subCategory;

        console.log(subCategory)
        addCategory({
            name,
            subCategory,
            organizationId: organization?.id ?? '',
        }).then((res) => {
            toast.success("Category created successfully");
        })
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8 mt-4">
                <section className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="name"
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
                    <div className="flex flex-col items-start justify-between mt-4 w-full">
                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-2">
                                <Label>sub category {index + 1}</Label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <Controller
                                                name={`subCategory.${index}`}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="name"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {form.formState.errors.subCategory?.[index] && (
                                                <p className="text-red-500">
                                                    {form.formState.errors.subCategory[index].message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => remove(index)}
                                            variant="destructive"
                                            size={'icon'}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            size={'lg'}
                            variant={'outline'}
                            onClick={() => append({ name: "", value: "" })}
                            className="my-2"
                        >
                            Add sub category
                        </Button>
                    </div>
                    <Button type="submit">Submit</Button>
                </section>
            </form>
        </Form>
    )
}