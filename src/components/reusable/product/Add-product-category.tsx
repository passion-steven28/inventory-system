"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";

export default function AddProductCategory() {
    // const organization = useOrganization();
    const { organization } = useOrganization();
    console.log(organization?.id);
    const data = useQuery(api.category.getCategories, {
        organizationId: organization?.id ?? '',
    })
    const subcategory = useQuery(api.subCategory.getSubCategories, {
        organizationId: organization?.id ?? '',
        categoryId: data?.[0]?._id ?? '',
    })

    console.log(subcategory);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category">
                            <SelectTrigger id="category" aria-label="Select category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map((item) => (
                                    <SelectItem key={item._id} value={item.name}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="subcategory">Subcategory (optional)</Label>
                        <Select name="subcategory">
                            <SelectTrigger id="subcategory" aria-label="Select subcategory">
                                <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                {subcategory?.map((item) => (
                                    <SelectItem key={item._id} value={item.name}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
