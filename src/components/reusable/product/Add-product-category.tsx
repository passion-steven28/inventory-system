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

export default function AddProductCategory() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                            <SelectTrigger id="category" aria-label="Select category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="clothing">Clothing</SelectItem>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="subcategory">Subcategory (optional)</Label>
                        <Select>
                            <SelectTrigger id="subcategory" aria-label="Select subcategory">
                                <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                                <SelectItem value="hoodies">Hoodies</SelectItem>
                                <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
