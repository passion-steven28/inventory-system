import AsideBar from "@/components/shared/AsideBar"
import MobileNav from "@/components/shared/MobileNav"
import { useOrganizationList } from "@clerk/nextjs";
import { auth, Organization } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function layout({ children }: { children: React.ReactNode }) {
    // const orgId = auth().orgId;

    // console.log(orgId);

    // if (!orgId) redirect('/create-organization');

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
            <div className="sticky top-0 z-10 md:h-screen">
                <AsideBar />
            </div>
            <div className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 backdrop-blur-xl">
                    <MobileNav />
                </div>
                {children}
            </div>
        </div>
    )
}
