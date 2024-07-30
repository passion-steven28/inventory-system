import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCategory = mutation({
    args: {
        name: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        await ctx.db.insert("category", {
            name: args.name,
            organizationId: args.organizationId,
        });
    },
});

export const getCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('category')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories;
    },
});

export const getTotalCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('category')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories.length;
    },
});