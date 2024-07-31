"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddProductStock() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock</CardTitle>
                <CardDescription>
                    add stock for product
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">stock quantity</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            className="w-full"
                            placeholder="100"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Min stockThreshold</Label>
                        <Input
                            id="threshold"
                            name="minStockThreshold"
                            type="number"
                            className="w-full"
                            placeholder="10"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Buying price</Label>
                        <Input
                            id="buyingPrice"
                            name="buyingPrice"
                            type="number"
                            className="w-full"
                            placeholder="1000"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Selling price</Label>
                        <Input
                            id="sellingPrice"
                            name="sellingPrice"
                            type="number"
                            className="w-full"
                            placeholder="1500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
