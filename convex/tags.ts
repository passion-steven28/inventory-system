import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTag = mutation({
    args: {
        name: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.insert("tag", {
            name: args.name,
            organizationId: args.organizationId,
        });
    },
});

export const getTags = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const tags = await ctx.db.query('tag')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return tags;
    },
});

export const getTagByName = query({
    args: {
        name: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const tag = await ctx.db.query('tag')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('name'), args.name))
            .unique()

        return tag;
    },
});

export const getTotalTags = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const tags = await ctx.db.query('tag')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return tags.length;
    },
});