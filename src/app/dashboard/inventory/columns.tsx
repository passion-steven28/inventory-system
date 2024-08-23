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
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type product = {
    item?: {
        buyingPrice?: number;
        createdAt?: number;
        currentStock?: number;
        lastUpdated?: number;
        minStockThreshold?: number;
        openStock?: number;
        organizationId?: string;
        productId?: string;
        sellingPrice?: number;
        status?: string;
        supplierId?: string;
        _creationTime?: number;
        _id?: string;
    };
    product?: {
        brandId?: string;
        category?: string;
        description?: string;
        organizationId?: string;
        productName?: string;
        propertyId?: string[];
        subCategory?: string;
        _creationTime?: number;
        _id?: string;
    };
    supplier?: {
        description?: string;
        email?: string;
        imageUrl?: string;
        organizationId?: string;
        phone?: string;
        supplierName?: string;
        _creationTime?: number;
        _id?: string;
    };
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
            // return <div className="text-right font-medium">{`${row.original.item?._id?.slice(0, 5)}...`}</div>
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
        },
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.original?.product?.productName || 'N/A'}</div>
        },
    },
    {
        accessorKey: "buying price",
        header: () => <div className="text-right">Buying Price</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.original.item?.buyingPrice}</div>
        },
    },
    {
        accessorKey: "selling price",
        header: () => <div className="text-right">Selling Price</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.original.item?.sellingPrice}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-right">Quantity</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("quantity"))

            return <div className="text-right font-medium">{row.original.item?.openStock}</div>
        },
    },
    {
        accessorKey: "category",
        header: () => <div className="text-right">Category</div>,
        cell: ({ row }) => {

            return <div className="text-right font-medium">{row.original.product?.category}</div>
        },
    },

    {
        accessorKey: "subCategory",
        header: () => <div className="text-right">SubCategory</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.original.product?.subCategory}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={row.original.item?.status === 'rowInStock' ? 'destructive' : 'outline'}
            >
                {row.original.item?.status}
            </Badge>
        ),
    },
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.supplier?.supplierName}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            // Directly use router.push in the onClick handler
            const HandleView = () => {
                const productId = row.original.item?._id ?? "";
                useRedirect(productId);
            };

            const HandleEdit = () => {
                const productId = row.original.item?._id ?? "";
                useEdit(productId);
            };

            const HandleDelete = () => {
                const productId = row.original.item?._id ?? "";
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
