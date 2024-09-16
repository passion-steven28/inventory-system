import Invoice from "@/components/order/invoice"
import Dashboard from "@/components/order/Dashboard"
import Orders from "@/components/order/Orders"

export default function page() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <Dashboard />
                    <Orders />
                </div>
                <div>
                    <Invoice />
                </div>
            </main>
        </div>
    )
}
