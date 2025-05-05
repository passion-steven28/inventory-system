import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';

export const createProduct = mutation({
    args: {
        productName: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        category: v.optional(v.id('category')), // Expect ID type
        subCategory: v.optional(v.id('subcategory')), // Expect ID type
        brand: v.optional(v.id('brand')),
        properties: v.optional(v.array(v.object({
            propertyName: v.string(),
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
                    propertyName: property.propertyName,
                    value: property.value,
                }).then((propertyId) => {
                    productIds.push(propertyId);
                });
            }
        }

        // Insert the product
        const productId = await ctx.db.insert("product", {
            productName: args.productName,
            description: args.description,
            category: args.category, // Remove type assertion
            subCategory: args.subCategory, // Remove type assertion
            brandId: args.brand,
            organizationId: args.organizationId,
            propertyId: productIds,
        })

        return productId;
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
            let productProperties: any[] = [];
            if (products.propertyId && products.propertyId.length > 0) {
                // Fetch all properties in parallel
                productProperties = await Promise.all(
                    products.propertyId.map(id => ctx.db.get(id))
                );
                // Filter out any null results if a property was deleted
                productProperties = productProperties.filter(p => p !== null);
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
        productName: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            productName: args.productName,
            description: args.description,
            imageUrl: args.imageUrl,
            category: args.category as Id<"category"> | undefined,
            subCategory: args.subCategory as Id<"subcategory"> | undefined,
            organizationId: args.organizationId,
        });

        // Return the ID of the updated product
        return { productId: args.id };
    },
});
