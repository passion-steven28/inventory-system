import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const createOrderItem = mutation({
    args: {
        organizationId: v.string(),
        productId: v.id('product'),
        quantity: v.number(),
        price: v.number(),
        orderId: v.id('order'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Insert the product and user details
        const orderItemId = await ctx.db.insert("orderItem", {
            organizationId: args.organizationId,
            productId: args.productId,
            quantity: args.quantity,
            price: args.price,
            orderId: args.orderId,
        });
    }
});


export const getOrderItems = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const orderItems = await ctx.db.query('orderItem')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .order('desc')
            .collect();

        return orderItems;
    },
});