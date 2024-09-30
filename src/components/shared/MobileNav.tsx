import Link from "next/link"
import {
    AreaChart,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Package2Icon,
    Search,
    ShoppingBag,
    ShoppingCart,
    Users,
    UsersIcon,
    Truck,
    Shirt,
    Plus,
    Eye
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
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "../ui/logo"
import { OrganizationList, OrganizationProfile, OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Organization, OrganizationMembership } from "@clerk/backend"
const navLinks = [
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
];

const MobileNav = () => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Logo
                            src="logo.svg"
                            alt="logo"
                        />
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navLinks.map((link) => (
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
                    </nav>
                    <div className="mt-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access to our
                                    support team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                    </div>
                </form>
            </div>
            <OrganizationSwitcher />
            {/* <UserButton /> */}
        </header>
    )
}

export default MobileNav