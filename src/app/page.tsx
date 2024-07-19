import { HeroSection } from "@/components/HeroSection";

import { DollarSign, DollarSignIcon, Link } from "lucide-react";

export default function Home() {
    return (
        <main>
            <HeroSection />
        </main>
    );
}

const salesData = [
    {
        title: "Total Revenue",
        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
        value: "$45.89",
        change: "+20.1% from last month",
    },
    {
        title: "Total Sales",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        value: "$45.1",
        change: "+20.1% from last month",
    },
    {
        title: "Total Profit",
        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
        value: "$45,231.89",
        change: "+20.1% from last month",
    },
    {
        title: "Total Cost",
        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
        value: "$45,231.89",
        change: "+20.1% from last month",
    },
];

const InventoryData = [
    {
        title: "Total Inventory",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        value: "$45.89",
        change: "+20.1% from last month",
    },
    {
        title: "Total Inventory",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        value: "$45.1",
        change: "+20.1% from last month",
    },
    {
        title: "Total Inventory",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        value: "$45.1",
        change: "+20.1% from last month",
    }
];
