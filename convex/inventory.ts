import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';

export const createInventory = mutation({
    args: {
        productId: v.id('product'),
        supplierId: v.id('supplier'),
        buyingPrice: v.optional(v.number()),
        sellingPrice: v.optional(v.number()),
        status: v.optional(v.string()),
        minStockThreshold: v.optional(v.number()),
        openStock: v.number(),
        currentStock: v.optional(v.number()),
        organizationId: v.string(),
        lastUpdated: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Create an inventory entry
        const inventoryId = await ctx.db.insert("inventory", {
            productId: args.productId,
            supplierId: args.supplierId,
            buyingPrice: args.buyingPrice,
            sellingPrice: args.sellingPrice,
            status: args.status,
            minStockThreshold: args.minStockThreshold,
            openStock: args.openStock,
            currentStock: args.currentStock,
            organizationId: args.organizationId,
            createdAt: Number(new Date()),
            lastUpdated: Number(new Date()),
        });

        return inventoryId;
    },
});

export const getInventory = query({
    args: {
        productId: v.id('product'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const inventory = await ctx.db.query('inventory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('productId'), args.productId))
            .collect();

        return inventory;
    },
});

export const getInventoryBySupplier = query({
    args: {
        supplierId: v.id('supplier'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const inventory = await ctx.db.query('inventory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('supplierId'), args.supplierId))
            .collect();

        return inventory;
    },
});

export const getInventoryByProduct = query({
    args: {
        productId: v.id('product'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const inventory = await ctx.db.query('inventory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('productId'), args.productId))
            .collect();

        return inventory;
    },
});

export const getTotalInventory = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const inventory = await ctx.db.query('inventory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        return inventory;
    },
});