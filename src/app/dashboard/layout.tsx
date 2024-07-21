import AsideBar from "@/components/shared/AsideBar"
import MobileNav from "@/components/shared/MobileNav"

export default function layout({children}: {children: React.ReactNode}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AsideBar />
            <div className="flex flex-col gap-2">
                <MobileNav />
                {children}
            </div>
        </div>
    )
}
