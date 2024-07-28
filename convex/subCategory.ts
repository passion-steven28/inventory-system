import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSubCategory = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        organizationId: v.string(),
        categoryId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        await ctx.db.insert("subcategory", {
            name: args.name,
            description: args.description,
            organizationId: args.organizationId,
            categoryId: args.categoryId,
        });
    },
});

export const getSubCategories = query({
    args: {
        organizationId: v.string(),
        categoryId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .filter((q) => q.eq(q.field('categoryId'), args.categoryId))
            .collect();

        return categories;
    },
});

export const getTotalSubCategories = query({
    args: {
        organizationId: v.string(),
        categoryId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .filter((q) => q.eq(q.field('categoryId'), args.categoryId))
            .collect();

        return categories.length;
    },
});