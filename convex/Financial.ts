import { query } from "./_generated/server";
import { v } from "convex/values";

export const calculateFinancialMetrics = query({
    args: {
        organizationId: v.string(),
        startDate: v.string(),
        endDate: v.string()
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args;

        // Calculate Revenue
        const sales = await ctx.db
            .query("order")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("orderDate"), startDate) && q.lte(q.field("orderDate"), endDate))
            .collect();

        const revenue = sales.reduce((total, sale) => total + (sale.totalPrice ?? 0), 0);

        // Calculate Cost
        const inventoryTransactions = await ctx.db
            .query("inventoryTransaction")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("lastUpdated"), startDate) && q.lte(q.field("lastUpdated"), endDate))
            .collect();

        const cost = inventoryTransactions
            .filter((transaction) => transaction.type === "purchase")
            .reduce((total, transaction) => total + (transaction.quantity * transaction.price), 0);

        // Calculate Profit
        const profit = revenue - cost;

        return { revenue, cost, profit };
    },
});