import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBrand = mutation({
    args: {
        brandName: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.insert("brand", {
            brandName: args.brandName,
            organizationId: args.organizationId,
        });
    },
});

export const getBrands = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const brands = await ctx.db.query('brand')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return brands;
    },
});

export const getBrandByName = query({
    args: {
        brandName: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const brand = await ctx.db.query('brand')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('brandName'), args.brandName))
            .unique()

        return brand;
    },
});

export const getTotalBrands = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const brands = await ctx.db.query('brand')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return brands.length;
    },
});