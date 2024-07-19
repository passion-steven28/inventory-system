"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

export function HeroSection() {
    return <HeroParallax products={products} />;
}
export const products = [
    {
        title: "Dashboard",
        link: "/dashboard",
        thumbnail:"/images/Screenshot-1.png",
    },
    {
        title: "Dashboard",
        link: "/dashboard",
        thumbnail:"/images/Screenshot-2.png",
    },
    {
        title: "Dashboard",
        link: "/dashboard",
        thumbnail:"/images/screenshot-3.png",
    },
    {
        title: "Dashboard",
        link: "/dashboard",
        thumbnail:"/images/screenshot-4.png",
    },
];
