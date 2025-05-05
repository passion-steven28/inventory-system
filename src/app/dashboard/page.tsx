'use client'
import { SalesChart } from "@/components/chart/SalesChart";
import { ChartComp } from "@/components/ChartComp";
import CreateOrganization from "@/components/organization/CreateOrganization";
import { CustomOrganizationSwitcher } from "@/components/organization/CustomOrganizationSwitcher";
import { InvitationList, InviteMember } from "@/components/organization/InvitationList";
import { JoinedOrganizations } from "@/components/organization/JoinedOrganizations";
import { ManageRoles } from "@/components/organization/ManageRoles";
import { MembershipRequests } from "@/components/organization/MembershipRequests";
import DashboardCard, {
  DashboardCardWrapper,
} from "@/components/reusable/DashboardCard";
import Grids from "@/components/reusable/Grids";
import LinkTableWrapper from "@/components/table/LinkTableWrapper";
import { LowQuantityTable } from "@/components/table/LowQuantityTable";
import { TopSellingTable } from "@/components/table/TopSellingTable";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { DollarSign, DollarSignIcon, Link } from "lucide-react";
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"
import useShortNumber from "@/hooks/shortNumbers";
import { useEffect } from "react";
import { useFormatNumber } from "@/lib/hooks/useFormatNumber";



export default function Home() {
  const formatNumber = useFormatNumber();
  const { organization } = useOrganization()
  const financialMetrics = useQuery(api.inventoryTransaction.calculateFinancialMetrics, {
    organizationId: organization?.id ?? '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  const salesData = [
    {
      title: "Total Revenue",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      value: formatNumber(financialMetrics?.revenue ?? 0),
      change: "+20.1% from last month",
    },
    {
      title: "Total Sales",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      value: formatNumber(financialMetrics?.profit ?? 0),
      change: "+20.1% from last month",
    },
    {
      title: "Total cost",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      value: formatNumber(financialMetrics?.cost ?? 0),
      change: "+20.1% from last month",
    },
    {
      title: "Total expenses",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      value: formatNumber(financialMetrics?.totalExpenses ?? 0),
      change: "+20.1% from last month",
    },
    {
      title: "Net Profit",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      value: formatNumber(financialMetrics?.netProfit ?? 0),
      change: "+20.1% from last month",
    },
  ];

  return (
    <main className="grid place-content-center w-full grid-cols-1 md:grid-cols-12 gap-4 px-2">
      <div className="md:col-start-1 md:col-end-13 md:row-start-1 md:row-end-2">
        <DashboardCardWrapper wrapperTitle="Sales overview">
          {salesData.map((data) => (
            <DashboardCard
              key={data.title}
              dashboardCardTitle={data.title}
              dashboardCardIcon={data.icon}
              dashboardCardValue={data.value}
              dashboardCardChange={data.change}
            />
          ))}
        </DashboardCardWrapper>
      </div>
      {/* <div className="md:col-start-8 md:col-end-13 md:row-start-1 md:row-end-2 lg:row-start-1 lg:row-end-2">
        <DashboardCardWrapper wrapperTitle="Orders overview">
          {InventoryData.map((data) => (
            <DashboardCard
              key={data.title}
              dashboardCardTitle={data.title}
              dashboardCardIcon={data.icon}
              dashboardCardValue={data.value}
              dashboardCardChange={data.change}
            />
          ))}
        </DashboardCardWrapper>
      </div> */}
      <div className="md:col-start-1 md:col-end-13 row-start-3 row-end-4 md:row-start-2 md:row-end-3">
        <SalesChart />
      </div>
      <div className="md:col-start-1 md:col-end-8 md:row-start-3 md:row-end-auto">
        <LinkTableWrapper title="Top Selling" url="/dashboard/top-selling">
          <TopSellingTable />
        </LinkTableWrapper>
      </div>
      <div className="md:col-start-8 md:col-end-13 row-start-5 md:row-start-3 row-end-auto w-full">
        <LinkTableWrapper title="Low quantity stock" url="/dashboard/low-quantity-stock">
          <LowQuantityTable />
        </LinkTableWrapper>
      </div>
    </main>
  );
}



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
