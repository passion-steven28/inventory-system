import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const createCustomer = mutation({
    args: {
        customerName: v.string(),
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

        // Insert the customer
        const customerId = await ctx.db.insert("customer", {
            customerName: args.customerName,
            description: args.description,
            phone: args.phone,
            email: args.email,
            imageUrl: args.imageUrl,
            organizationId: args.organizationId,
        });

        return customerId;
    }
});

export const getCustomers = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const customers = await ctx.db.query('customer')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .order('desc')
            .collect();

        return customers;
    },
});

export const getTotalCustomers = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const customers = await ctx.db.query('customer')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        return customers.length;
    },
});

export const deleteCustomer = mutation({
    args: {
        id: v.id('customer'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }
        await ctx.db.delete(args.id);
    },
});

export const updateCustomer = mutation({
    args: {
        id: v.id('customer'),
        customerName: v.optional(v.string()),
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
            customerName: args.customerName,
            email: args.email,
            phone: args.phone,
            description: args.description,
            imageUrl: args.imageUrl,
            organizationId: args.organizationId,
        });

        return { customerId: args.id };
    },
});