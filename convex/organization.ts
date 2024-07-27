import { ConvexError, v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

export const getOrganizationById = query({
    args: { clerkOrgId: v.string() },
    handler: async (ctx, args) => {
        const organization = await ctx.db
            .query("organization")
            .filter((q) => q.eq(q.field("clerkOrgId"), args.clerkOrgId))
            .unique();

        if (!organization) {
            throw new ConvexError("Organization not found");
        }

        return organization;
    },
});


export const createOrganization = internalMutation({
    args: {
        clerkOrgId: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("organization", {
            clerkOrgId: args.clerkOrgId,
            name: args.name,
        });
    },
});

export const updateOrganization = internalMutation({
    args: {
        clerkOrgId: v.string(),
        name: v.string(),
    },
    async handler(ctx, args) {
        const organization = await ctx.db
            .query("organization")
            .filter((q) => q.eq(q.field("clerkOrgId"), args.clerkOrgId))
            .unique();

        if (!organization) {
            throw new ConvexError("Organization not found");
        }

        await ctx.db.patch(organization._id, {
            name: args.name,
        });
    },
});

export const deleteOrganization = internalMutation({
    args: { clerkOrgId: v.string() },
    async handler(ctx, args) {
        const organization = await ctx.db
            .query("organization")
            .filter((q) => q.eq(q.field("clerkOrgId"), args.clerkOrgId))
            .unique();

        if (!organization) {
            throw new ConvexError("Organization not found");
        }

        await ctx.db.delete(organization._id);
    },
});