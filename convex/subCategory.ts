import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSubCategory = mutation({
    args: {
        name: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        await ctx.db.insert("subcategory", {
            name: args.name,
            organizationId: args.organizationId,
        });
    },
});

export const getSubCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories;
    },
});

export const getTotalSubCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories.length;
    },
});