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
import { useMutation, useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createCategory } from "../../../../convex/category";
import { createSubCategory } from "../../../../convex/subCategory";
import { toast } from "sonner"
import { useState } from "react";
import CreateCategoryComp from "@/components/category/create-category";

export default function AddProductCategory() {
    const [c, setC] = useState<string>("");
    const [s, setS] = useState<string>("");
    console.log(c,s);
    const { organization } = useOrganization();

    const data = useQuery(api.category.getCategories, {
        organizationId: organization?.id ?? '',
    })
    const subcategory = useQuery(api.subCategory.getSubCategories, {
        organizationId: organization?.id ?? '',
    })
    const createCategory = useMutation(api.category.createCategory);
    const createSubCategory = useMutation(api.subCategory.createSubCategory);

    const HandleAddCategory = async () => {
        console.log(c, s);

        if (!c && !s) {
            console.log("Neither category nor subcategory is provided.");
            return;
        }
        try {
            if (c) {
                const newCategory = await createCategory({
                    name: c,
                    organizationId: organization?.id ?? '',
                });
                toast("Category has been created.");
                setC("");
            }
            if (s) {
                const newSubCategory = await createSubCategory({
                    name: s,
                    organizationId: organization?.id ?? '',
                    categoryId: ""
                });
                toast("Subcategory has been created.");
                setS("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        HandleAddCategory();
        e.target.reset();
    }

    console.log(subcategory);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Product Category</CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add new category</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Add product category and sub category
                            </DialogDescription>
                        </DialogHeader>
                        <CreateCategoryComp />
                    </DialogContent>
                </Dialog>
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
                                    <SelectItem 
                                    key={item._id} 
                                    value={item.name}>{item.name}</SelectItem>
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
