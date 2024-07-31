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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type supplier = {
    _id?: string
    _creationTime?: number
    name?: string
    email?: string
    phone?: string
    address?: string
    description?: string
    imageUrl?: string
    organizationId?: string
}


export const columns: ColumnDef<supplier>[] = [
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

            return <div className="text-right font-medium">{`${row.original._id?.slice(0, 5)}...`}</div>
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
        accessorKey: "email",
        header: () => <div className="text-right">Email</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("email")}</div>
        },
    },
    {
        accessorKey: "phone",
        header: () => <div className="text-right">Phone</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("phone")}</div>
        },
    },
    {
        accessorKey: "address",
        header: () => <div className="text-right">Address</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("address")}</div>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText('payment id')}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick = {() => console.log("delete")}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
