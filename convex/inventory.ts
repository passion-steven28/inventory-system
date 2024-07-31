import { query } from "./_generated/server";
import { v } from "convex/values";

export const getOrgTotalInventory = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        // First, get all products for the organization
        const products = await ctx.db
            .query("product")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", args.organizationId))
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


export const getLowStockProducts = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        // Get all products for the organization
        const products = await ctx.db
            .query("product")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", args.organizationId))
            .collect();

        let lowStockProducts = [];

        for (const product of products) {
            // Get the inventory for this product
            const inventory = await ctx.db
                .query("inventory")
                .withIndex("byProductId", (q) => q.eq("productId", product._id))
                .unique();

            const currentQuantity = inventory ? inventory.quantity : 0;

            // Check if the current quantity is below the minimum stock threshold
            if (typeof product.minStockThreshold === 'number' && currentQuantity < product.minStockThreshold) {
                lowStockProducts.push({
                    productId: product._id,
                    name: product.name,
                    currentQuantity: currentQuantity,
                    minStockThreshold: product.minStockThreshold,
                    deficit: product.minStockThreshold - currentQuantity
                });
            }
        }

        // Sort the low stock products by the deficit (highest deficit first)
        lowStockProducts.sort((a, b) => b.deficit - a.deficit);
        return lowStockProducts;
    },
});