import { query } from "./_generated/server";
import { v } from "convex/values";

export const getOrgTotalInventory = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        // First, get all products for the organization
        const products = await ctx.db
            .query("product")
            .withIndex("organizationId", (q) => q.eq("organizationId", args.organizationId))
            .collect();

        let totalQuantity = 0;
        let productInventories = [];

        // For each product, get its inventory and sum up the quantities
        for (const product of products) {
            const inventory = await ctx.db
                .query("inventory")
                .withIndex("byProductId", (q) => q.eq("productId", product._id))
                .unique();

            const quantity = inventory ? inventory.quantity : 0;
            totalQuantity += quantity;

            productInventories.push({
                productId: product._id,
                name: product.name,
                quantity: quantity
            });
        }

        return {
            totalQuantity,
            productInventories
        };
    },
});