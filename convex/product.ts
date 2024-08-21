import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';

export const createProduct = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        brand: v.optional(v.id('brand')),
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
            category: args.category,
            subCategory: args.subCategory,
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
            name: args.name,
            description: args.description,
            imageUrl: args.imageUrl,
            category: args.category,
            subCategory: args.subCategory,
            organizationId: args.organizationId,
        });

        // delete inventory entry
        await ctx.db.delete(args.id);

        return { productId: args.id };
    },
});
