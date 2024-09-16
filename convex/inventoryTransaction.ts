import { query } from "./_generated/server";
import { v } from "convex/values";

export const calculateFinancialMetrics = query({
    args: { organizationId: v.string(), startDate: v.string(), endDate: v.string() },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args;

        // Calculate Revenue
        const sales = await ctx.db
            .query("order")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
            .collect();

        const revenue = sales.reduce((total, sale) => total + (sale.totalPrice ?? 0), 0);

        // Calculate Cost
        const inventoryTransactions = await ctx.db
            .query("inventoryTransaction")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
            .collect();

        const cost = inventoryTransactions
            .filter((transaction) => transaction.type === "purchase")
            .reduce((total, transaction) => total + (transaction.quantity * transaction.price), 0);

        // Calculate Profit
        const profit = cost - revenue;

        // Calculate Net Profit
        const expenses = await ctx.db
            .query("expenses")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
            .collect();
        
        const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
        
        const netProfit = profit - expenses.reduce((total, expense) => total + expense.amount, 0);

        console.log('sales', sales, 'revenue', revenue, 'cost', cost, 'profit', profit, 'netProfit', netProfit);

        return { revenue, cost, profit, totalExpenses, netProfit };
    },
});


// export const calculateProductFinancialMetrics = query({
//     args: { organizationId: v.string(), startDate: v.number(), endDate: v.number() },
//     handler: async (ctx, args) => {
//         const { organizationId, startDate, endDate } = args;

//         // Get all products for the organization
//         const products = await ctx.db
//             .query("inventory")
//             .withIndex("byOrganizationId", (q) => q.eq("organizationId", organizationId))
//             .collect();

//         const productMetrics = await Promise.all(products.map(async (product) => {
//             // Calculate Revenue
//             const orders = await ctx.db
//                 .query("orderItem")
//                 .filter((q) =>
//                     q.eq(q.field("productId"), product._id) &&
//                     q.gte(q.field("date"), startDate) &&
//                     q.lte(q.field("date"), endDate)
//                 )
//                 .collect();

//             const revenue = orders.reduce((total, order) => total + (order.quantity * order.price), 0);

//             // Calculate Cost
//             const purchases = await ctx.db
//                 .query("inventoryTransaction")
//                 .withIndex("byProductId", (q) => q.eq("productId", product._id))
//                 .filter((q) =>
//                     q.eq(q.field("type"), "purchase") &&
//                     q.gte(q.field("lastUpdated"), startDate) &&
//                     q.lte(q.field("lastUpdated"), endDate)
//                 )
//                 .collect();

//             const cost = purchases.reduce((total, purchase) => total + (purchase.quantity * purchase.price), 0);

//             // Calculate Profit
//             const profit = revenue - cost;

//             // Get current inventory level
//             const inventory = await ctx.db
//                 .query("inventory")
//                 .withIndex("byProductId", (q) => q.eq("productId", product._id))
//                 .unique();

//             return {
//                 productId: product._id,
//                 productName: product.name,
//                 revenue,
//                 cost,
//                 profit,
//                 currentStock: inventory ? inventory.quantity : 0
//             };
//         }));

//         return productMetrics;
//     },
// });