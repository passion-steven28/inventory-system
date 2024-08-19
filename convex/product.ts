import { product } from './../src/app/dashboard/products/columns';
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';
import { getOrgTotalInventory } from './inventory';
export const createProduct = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        buyingPrice: v.optional(v.number()),
        sellingPrice: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        quantity: v.number(),
        status: v.string(),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        brand: v.optional(v.id('brand')),
        minStockThreshold: v.optional(v.number()),
        properties: v.optional(v.array(v.object({
            name: v.string(),
            value: v.union(v.string(), v.number()),
        }))),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        let productIds: Id<'property'>[] = [];

        // add properties
        if (args.properties) {
            for (const property of args.properties) {
                await ctx.db.insert("property", {
                    organizationId: args.organizationId,
                    name: property.name,
                    value: property.value,
                }).then((propertyId) => {
                    productIds.push(propertyId);
                });
            }
        }

        // Insert the product
        const productId = await ctx.db.insert("product", {
            name: args.name,
            description: args.description,
            sellingPrice: args.sellingPrice,
            buyingPrice: args.buyingPrice,
            status: args.status,
            category: args.category,
            subCategory: args.subCategory,
            brandId: args.brand,
            organizationId: args.organizationId,
            minStockThreshold: args.minStockThreshold,
            propertyId: productIds,
            quantity: args.quantity,
        })

        // Create an inventory entry
        const inventoryId = await ctx.db.insert("inventory", {
            productId,
            quantity: args.quantity,
            organizationId: args.organizationId,
        });

        // update currentQuantity
        await ctx.db.patch(productId, {
            currentStock: args.quantity,
        });

        return { productId, inventoryId };
    },
});

export const getProducts = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const products = await ctx.db.query('product')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .order('desc')
            .collect();

        return products;
    },
});

export const getProduct = query({
    args: {
        id: v.id('product'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }
        const products = await ctx.db.query('product')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('_id'), args.id))
            .unique()
        
            
        if (products) { 
            console.log(products);
            const productPropertiesId = products?.propertyId as unknown as Id<'property'>[];
            let productProperties = [];
            for (const propertyId of productPropertiesId) { 
                const property = await ctx.db.get(propertyId);
                productProperties.push(property);
            }
            return { product: products, productProperties };
        }
    },
});

export const getTotalProducts = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const products = await ctx.db.query('product')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return products.length;
    },
});

export const deleteProduct = mutation({
    args: {
        id: v.id('product'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }
        await ctx.db.delete(args.id);
    },
});

export const updateProduct = mutation({
    args: {
        id: v.id('product'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        sellingPrice: v.optional(v.number()),
        buyingPrice: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        quantity: v.optional(v.number()),
        status: v.optional(v.string()),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            description: args.description,
            sellingPrice: args.sellingPrice,
            buyingPrice: args.buyingPrice,
            imageUrl: args.imageUrl,
            quantity: args.quantity,
            status: args.status,
            category: args.category,
            subCategory: args.subCategory,
            organizationId: args.organizationId,
            userId: args.userId,
        });

        // delete inventory entry
        await ctx.db.delete(args.id);

        return { productId: args.id };
    },
});
