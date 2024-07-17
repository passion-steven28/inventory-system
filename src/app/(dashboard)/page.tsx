import { SalesChart } from "@/components/chart/SalesChart";
import { ChartComp } from "@/components/ChartComp";
import DashboardCard, {
  DashboardCardWrapper,
} from "@/components/reusable/DashboardCard";
import Grids from "@/components/reusable/Grids";
import { DollarSign, DollarSignIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="grid w-full grid-cols-12 gap-4 px-2">
      <div className="col-start-1 col-end-8 row-start-1 row-end-2">
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
      <div className="col-start-8 col-end-13">
        <DashboardCardWrapper wrapperTitle="Sales overview">
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
      </div>
      <div className="col-start-8 col-end-13 row-start-2 row-end-3">
        <DashboardCardWrapper wrapperTitle="Sales overview">
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
      </div>
      <div className="col-start-1 col-end-13 row-start-2 row-end-3">
        <SalesChart />
      </div>
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
