import { AreaChart, Home, Package, ShoppingBag, Truck, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <Home /> },
    { name: "Products", href: "/dashboard/products", icon: <ShoppingBag /> },
    { name: "Reports", href: "/dashboard/reports", icon: <AreaChart /> },
    { name: "Suppliers", href: "/dashboard/suppliers", icon: <Truck /> },
    { name: "Orders", href: "/dashboard/orders", icon: <Package /> },
    { name: "Users", href: "/dashboard/users", icon: <Users /> },
];

export default function NavigationBar({ }: Props) {
    return <div>
        <ul className='flex items-center justify-evenly w-full mt-2'>
            {navLinks.map((link) => (
                <li key={link.name}>
                    <Link
                        href={link.href}
                        className='flex items-center gap-2 px-4 py-2 text-primary-foreground text-sm font-medium transition-colors duration-150 hover:text-muted-foreground'>
                        {link.icon}
                        <span className='hidden md:flex items-center gap-1'>
                            {link.name}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>;
}
