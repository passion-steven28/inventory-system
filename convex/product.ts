import { product } from './../src/app/dashboard/products/columns';
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';
import { getOrgTotalInventory } from './inventory';
export const createProduct = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        quantity: v.number(),
        status: v.string(),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        organizationId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Insert the product
        const productId = await ctx.db.insert("product", {
            name: args.name,
            description: args.description,
            price: args.price,
            imageUrl: args.imageUrl,
            status: args.status,
            category: args.category,
            subCategory: args.subCategory,
            organizationId: args.organizationId,
            userId: args.userId,
            quantity: 0
        });

        // Create an inventory entry
        const inventoryId = await ctx.db.insert("inventory", {
            productId,
            quantity: args.quantity,
            organizationId: args.organizationId,
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
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .order('desc')
            .collect();

        return products;
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
        price: v.optional(v.number()),
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
            price: args.price,
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