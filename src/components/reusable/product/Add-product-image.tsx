"use client"

import Image from "next/image"
import { Upload } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AddProductImage() {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src="/placeholder.svg"
                        width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                        <button>
                            <Image
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder.svg"
                                width="84"
                            />
                        </button>
                        <button>
                            <Image
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder.svg"
                                width="84"
                            />
                        </button>
                        <Input type="file" name="image" className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed" />
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
