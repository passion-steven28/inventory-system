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

export default function AddProductStatus() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="inStock">
                            <SelectTrigger id="status" aria-label="Select status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inStock">inStock</SelectItem>
                                <SelectItem value="lowStock">lowStock</SelectItem>
                                <SelectItem value="outOfStock">outOfStock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
