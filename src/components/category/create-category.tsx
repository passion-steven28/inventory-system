"use client"

import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

const CreateCategoryComp = () => {
    const [c, setC] = useState<string>("");
    const [s, setS] = useState<string>("");
    console.log(c, s);
    const { organization } = useOrganization();

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
    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-6"
        >
            <div className="grid grid-cols-1 place-items-baseline gap-4">
                <Label htmlFor="category" className="text-right">
                    Category
                </Label>
                <Input
                    id="category"
                    name="category"
                    onChange={(e) => setC(e.target.value)}
                    placeholder="Electronics"
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-1 place-items-baseline gap-4">
                <Label htmlFor="subcategory" className="text-right">
                    Subcategory
                </Label>
                <Input
                    id="subcategory"
                    name="subcategory"
                    onChange={(e) => setS(e.target.value)}
                    placeholder="Mobile Phones"
                    className="col-span-3"
                />
            </div>
            <Button
                type="submit"
                size={'lg'}
            >
                Save changes
            </Button>
        </form>
    )
}

export default CreateCategoryComp
