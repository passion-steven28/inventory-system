import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProduct = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        quantity: v.number(),
        status: v.string(),
        categoryId: v.optional(v.string()),
        subCategoryId: v.optional(v.string()),
        tags: v.array(v.string()),
        organizationId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        await ctx.db.insert("product", {
            name: args.name,
            description: args.description,
            price: args.price,
            imageUrl: args.imageUrl,
            quantity: args.quantity,
            status: args.status,
            categoryId: args.categoryId,
            subCategoryId: args.subCategoryId,
            organizationId: args.organizationId,
            userId: args.userId,
        });
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