"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type product = {
    _id?: string
    _creationTime?: number
    name?: string
    description?: string
    price?: number
    imageUrl?: string
    quantity?: number
    categoryId?: string
    subCategoryId?: string
    status?: string
    organizationId?: string
    userId?: string
}

export const columns: ColumnDef<product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: () => <div className="text-right">Id</div>,
        cell: ({ row }) => {

            return <div className="text-right font-medium">{row.getValue("id")}</div>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-right">Quantity</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("quantity"))

            return <div className="text-right font-medium">{amount}</div>
        },
    },
    {
        accessorKey: "category",
        header: () => <div className="text-right">Category</div>,
        cell: ({ row }) => {

            return <div className="text-right font-medium">{row.getValue("category")}</div>
        },
    },

    {
        accessorKey: "subCategory",
        header: () => <div className="text-right">SubCategory</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("subCategory")}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
]
