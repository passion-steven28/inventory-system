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
        }).then(async (inventoryId) => {
            // Update the inventory transactions
            await ctx.db.insert("inventoryTransaction", {
                inventoryId,
                type: "purchase",
                quantity: args.openStock,
                price: args.buyingPrice || 0,
                organizationId: args.organizationId,
                lastUpdated: Number(new Date()),
            });

            // Update the inventory analysis
            const analyticsId = await ctx.db.query('analytics')
                .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
                .first();

            console.log('analyticsId', analyticsId);

            if (analyticsId) {
                console.log('patching analytics');
                
                await ctx.db.patch(analyticsId._id, {
                    totalCost: analyticsId.totalCost + (args.buyingPrice || 0) * args.openStock,
                });
            }
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
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        if (args.productId) {
            const inventory = await ctx.db.query('inventory')
                .filter((q) => q.eq(q.field('productId'), args.productId))
                .first()
            return inventory;
        }

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

        // Fetch all inventory items for the organization
        const inventoryItems = await ctx.db.query('inventory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        if (!inventoryItems || inventoryItems.length === 0) {
            return []; // Return empty array if no inventory
        }

        // Extract unique product and supplier IDs
        const productIds = Array.from(new Set(inventoryItems.map(item => item.productId)));
        const supplierIds = Array.from(new Set(inventoryItems.map(item => item.supplierId)));

        // Fetch all related products and suppliers in batches
        const products = await Promise.all(
            productIds.map(id => ctx.db.get(id))
        );
        const suppliers = await Promise.all(
            supplierIds.map(id => ctx.db.get(id))
        );

        // Create maps for quick lookup
        const productsMap = new Map(products.filter(p => p !== null).map(p => [p!._id, p]));
        const suppliersMap = new Map(suppliers.filter(s => s !== null).map(s => [s!._id, s]));

        // Combine inventory items with their product and supplier details
        const inventoryDetails = inventoryItems.map(item => ({
            item,
            product: productsMap.get(item.productId) || null,
            supplier: suppliersMap.get(item.supplierId) || null,
        }));

        // console.log('inventoryDetails', inventoryDetails);
        return inventoryDetails;
    }
});
