"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useEffect } from "react"
import { useDeleteProduct } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { useDelete, useEdit, useRedirect } from "@/hooks/tableColomnActions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type product = {
    _id?: string
    _creationTime?: number
    productName?: string
    description?: string
    price?: number
    imageUrl?: string
    categoryId?: string
    subCategoryId?: string
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
        header: () => <div className="text-left">Id</div>,
        cell: ({ row }) => {

            return <div className="text-left font-medium">{`${row.original._id?.slice(0, 5)}...`}</div>
        },
    },
    {
        accessorKey: "productName",
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
        accessorKey: "category",
        header: () => <div className="text-left">Category</div>,
        cell: ({ row }) => {
            return <div className="text-left font-medium">{row.getValue("category")}</div>
        },
    },

    {
        accessorKey: "subCategory",
        header: () => <div className="text-left">SubCategory</div>,
        cell: ({ row }) => {
            return <div className="text-left font-medium">{row.getValue("subCategory")}</div>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            // Directly use router.push in the onClick handler
            const HandleView = () => {
                const productId = row.original._id ?? "";
                useRedirect(productId);
            };

            const HandleEdit = () => {
                const productId = row.original._id ?? "";
                useEdit(productId);
            };

            const HandleDelete = () => {
                const productId = row.original._id ?? "";
                useDelete(productId);
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={HandleView}>
                            View More
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={HandleEdit}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={HandleDelete}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
