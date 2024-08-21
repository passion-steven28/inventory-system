import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const createSupplier = mutation({
    args: {
        supplierName: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Insert the supplier
        const supplierId = await ctx.db.insert("supplier", {
            supplierName: args.supplierName,
            description: args.description,
            phone: args.phone,
            email: args.email,
            imageUrl: args.imageUrl,
            organizationId: args.organizationId,
        });
    }
});

export const getSuppliers = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const suppliers = await ctx.db.query('supplier')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .order('desc')
            .collect();

        return suppliers;
    },
});

export const getTotalSuppliers = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const suppliers = await ctx.db.query('supplier')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        return suppliers.length;
    },
});

export const deleteSupplier = mutation({
    args: {
        id: v.id('supplier'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }
        await ctx.db.delete(args.id);
    },
});

export const updateSupplier = mutation({
    args: {
        id: v.id('supplier'),
        supplierName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            supplierName: args.supplierName,
            email: args.email,
            phone: args.phone,
            description: args.description,
            imageUrl: args.imageUrl,
            organizationId: args.organizationId,
        });

        return { supplierId: args.id };
    },
});