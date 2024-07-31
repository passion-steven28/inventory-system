import { product } from './../src/app/dashboard/products/columns';
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const createOrder = mutation({
    args: {
        productId: v.id('product'),
        items: v.array(v.object({
            productId: v.id('product'),
            quantity: v.number(),
            price: v.number(),
            orderId: v.id('order'),
        })),
        quantity: v.number(),
        price: v.number(),
        status: v.string(),
        customerId: v.id('customer'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Insert the product and user details
        const orderId = await ctx.db.insert("order", {
            productId: args.productId,
            items: args.items,
            quantity: args.quantity,
            price: args.price,
            status: args.status,
            customerId: args.customerId,
            organizationId: args.organizationId,
        });

        // reduce inventory quantity for each item
        for (const item of args.items) {
            const inventory = await ctx.db.query('inventory')
                .withIndex('byProductId', (q) => q.eq('productId', item.productId))
                .unique();

            if (inventory) {
                await ctx.db.patch(inventory._id, {
                    quantity: inventory.quantity - item.quantity,
                });
            }
        }

        // update currentQuantity for each item
        for (const item of args.items) {
            const product = await ctx.db.query('product')
                .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
                .filter((q) => q.eq(q.field('_id'), item.productId))
                .unique();

            if (product) {
                await ctx.db.patch(product._id, {
                    currentStock: product.currentStock ? product.currentStock - item.quantity : product.currentStock,
                });
            }
        }

        return { orderId };
    }
});


export const getOrders = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const orders = await ctx.db.query('order')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .order('desc')
            .collect();

        return orders;
    },
});

export const getTotalOrders = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const orders = await ctx.db.query('order')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        return orders.length;
    },
});

export const deleteOrder = mutation({
    args: {
        id: v.id('order'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }
        await ctx.db.delete(args.id);
    },
});

export const updateOrder = mutation({
    args: {
        id: v.id('order'),
        productId: v.optional(v.id('product')),
        items: v.optional(v.array(v.object({
            productId: v.id('product'),
            quantity: v.number(),
            price: v.number(),
            orderId: v.id('order'),
        }))),
        quantity: v.optional(v.number()),
        price: v.optional(v.number()),
        status: v.optional(v.string()),
        customerId: v.optional(v.id('customer')),
        organizationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            productId: args.productId,
            items: args.items,
            quantity: args.quantity,
            price: args.price,
            status: args.status,
            customerId: args.customerId,
            organizationId: args.organizationId,
        });

        // reduce inventory quantity for each item
        for (const item of args.items!) {
            const inventory = await ctx.db.query('inventory')
                .withIndex('byProductId', (q) => q.eq('productId', item.productId))
                .unique();

            if (inventory) {
                await ctx.db.patch(inventory._id, {
                    quantity: inventory.quantity - item.quantity,
                });
            }
        }
    },
});
