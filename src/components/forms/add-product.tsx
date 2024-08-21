"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import FormInput from "./form-input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useState } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { Label } from "../ui/label"
import { PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import MultipleSelector, { Option } from '../ui/multi-select';


const tagSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }).max(100, {
        message: "Title must be at most 100 characters.",
    }),
    description: z.string().optional(),
    category: z.string(),
    subCategory: z.string(),
    brand: z.string(),
    tags: z.array(tagSchema).min(1).optional(),
    properties: z.array(z.object({
        name: z.string(),
        value: z.union([z.string(), z.number()]),
    })),
})

type Props = {}

export default function AddProduct({ }: Props) {
    const { organization } = useOrganization();
    const [categoryId, setCategoryId] = useState<string>('undefined');

    
    const category = useQuery(api.category.getCategories, {
        organizationId: organization?.id ?? '',
    })
    const tags = useQuery(api.tags.getTags, {
        organizationId: organization?.id ?? '',
    })
    const subcategory = useQuery(api.subCategory.getSubCategories, {
        organizationId: organization?.id ?? '',
    })

    const OPTIONS: Option[] = tags?.map((tag) => ({
        label: tag.tagName,
        value: tag._id,
    })) ?? [];
    console.log(OPTIONS)

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const { control } = useForm();
    const { handleSubmit } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "properties",
    });

    const HandleCategoryChange = (value: any) => {
        setCategoryId(value);
    }
    const createProduct = useMutation(api.product.createProduct);
    const getCategoryId = useQuery(api.category.getCategoryByName, {
        categoryName: categoryId ?? '',
        organizationId: organization?.id ?? '',
    })
    const getSubCategories = useQuery(api.subCategory.getSubCategoryById, {
        categoryId: getCategoryId?._id as Id<'category'>,
        organizationId: organization?.id ?? '',
    })
    const getBrands = useQuery(api.brand.getBrands, {
        organizationId: organization?.id ?? '',
    })


    // 2. Define a submit handler.
    function OnSubmit(values: z.infer<typeof formSchema>) {
        const productName = values.title;
        const description = values.description;
        const category = values.category;
        const subCategory = values.subCategory;
        const brand = values.brand as Id<'brand'>;

        const properties = values.properties.map((property) => {
            return {
                propertyName: property.name,
                value: property.value,
            }
        })

        createProduct({
            productName,
            description,
            category,
            subCategory,
            brand,
            properties,
            organizationId: organization?.id ?? '',
        }).then((res) => {
            toast.success("Product created successfully");
        })

        form.reset()
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
                    <InputCardComponent title="Product property">
                        <div className="flex flex-col items-center justify-center mt-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="space-y-2">
                                    <Label>property {index + 1}</Label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <Controller
                                                    name={`properties.${index}.name`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="text"
                                                            placeholder="name"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {form.formState.errors.properties?.[index]?.name && (
                                                    <p className="text-red-500">
                                                        {form.formState.errors.properties[index].name.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Controller
                                                    name={`properties.${index}.value`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            placeholder="value"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {form.formState.errors.properties?.[index]?.value && (
                                                    <p className="text-red-500">
                                                        {form.formState.errors.properties[index].value.message}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => remove(index)}
                                                variant="destructive"
                                                size={'icon'}
                                                className="p-2"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={() => append({ name: "", value: "" })}
                                className="w-full my-2"
                            >
                                Add property
                            </Button>
                        </div>
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
                                            onValueChange={(e) => {
                                                HandleCategoryChange(e);
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger id="category" aria-label="Select category">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {category?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item.categoryName}>{item.categoryName}</SelectItem>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="subCategory" aria-label="Select sub category">
                                                <SelectValue placeholder="Select sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getSubCategories?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item.subCategoryName}>
                                                        {item.subCategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </InputCardComponent>
                    <InputCardComponent title="Product brand">
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>product brand</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        >
                                            <SelectTrigger id="brand" aria-label="Select brand">
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getBrands?.map((item) => (
                                                    <SelectItem
                                                        key={item._id}
                                                        value={item._id}>{item.brandName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </InputCardComponent>
                    <InputCardComponent title="Product tags">
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            {...field}
                                            defaultOptions={OPTIONS}
                                            placeholder="Select tags you like..."
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    no results found.
                                                </p>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
