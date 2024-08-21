import { product } from './../src/app/dashboard/products/columns';
import { supplier } from './../src/app/dashboard/suppliers/columns';
import { products } from './../src/components/HeroSection';
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

export const getAllInventory = query({
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
        
        if (inventory) {
            let inventoryDetails = [];

            for (const item of inventory) {
                const productItems = await ctx.db.query('product')
                    .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
                    .filter((q) => q.eq(q.field('_id'), item.productId))
                    .collect();
                
                const supplierItems = await ctx.db.query('supplier')
                    .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
                    .filter((q) => q.eq(q.field('_id'), item.supplierId))
                    .collect();
                
                // Assuming there's only one product and supplier per inventory item
                const product = productItems[0];
                const supplier = supplierItems[0];

                // Create a new object for this inventory item that includes product and supplier details
                const inventoryDetail = {
                    ...item, // Spread the original inventory item properties
                    ...product, // Add the product detail
                    ...supplier, // Add the supplier detail
                };

                inventoryDetails.push(inventoryDetail);
                console.log(inventoryDetails);
            }

            return { products: inventoryDetails};
        }
    }
});
