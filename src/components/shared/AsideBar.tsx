import Link from "next/link"
import {
    Bell,
    CircleUser,
    Eye,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Plus,
    Search,
    Shirt,
    ShoppingCart,
    Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Logo from "../ui/logo"


const AsideBarLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: <Home className="h-4 w-4" />,
    },
    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: <ShoppingCart className="h-4 w-4" />,
        childLinks: [
            {
                name: "create",
                href: "/dashboard/orders/create",
                icon: <Plus className="h-4 w-4" />,
            },
            {
                name: "view",
                href: "/dashboard/orders/view",
                icon: <Eye className="h-4 w-4" />,
            }
        ]
    },
    {
        name: "Inventory",
        href: "/dashboard/inventory",
        icon: <Package className="h-4 w-4" />,
        childLinks: [
            {
                name: "create",
                href: "/dashboard/products/create",
                icon: <Plus className="h-4 w-4" />,
            },
            {
                name: "categories",
                href: "/dashboard/products/categories",
                icon: <Package2 className="h-4 w-4" />,
            },
            {
                name: "suppliers",
                href: "/dashboard/products/suppliers",
                icon: <Users className="h-4 w-4" />,
            }
        ]
    },
    {
        name: "Products",
        href: "/dashboard/products",
        icon: <Shirt className="h-4 w-4" />,
    },
    {
        name: "Suppliers",
        href: "/dashboard/suppliers",
        icon: <Users className="h-4 w-4" />,
    },
    {
        name: "Customers",
        href: "/dashboard/customers",
        icon: <Users className="h-4 w-4" />,
    },
    {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: <LineChart className="h-4 w-4" />,
    },
]

const AsideBar = () => {
    return (
        <aside className="hidden border-r bg-muted/40 md:block h-full">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo
                        src="logo.svg"
                        alt="logo"
                    />
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {AsideBarLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Card x-chunk="dashboard-02-chunk-0">
                        <CardHeader className="p-2 pt-0 md:p-4">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to our support
                                team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </aside>
    )
}

export default AsideBar