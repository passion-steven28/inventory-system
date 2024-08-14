import { product } from './../src/app/dashboard/products/columns';
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from './_generated/dataModel';

export const createOrder = mutation({
    args: {
        customerId: v.id('customer'),
        organizationId: v.string(),
        status: v.string(),
        orderItems: v.array(
            v.object({
                productId: v.id('product'),
                quantity: v.number(),
                price: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Calculate total price
        const totalPrice = args.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Insert the order
        const orderId = await ctx.db.insert("order", {
            customerId: args.customerId,
            organizationId: args.organizationId,
            status: args.status,
            totalPrice,
            orderDate: new Date().toISOString(),
        });

        // Insert order items
        for (const item of args.orderItems) {
            await ctx.db.insert("orderItem", {
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                organizationId: args.organizationId,
            });
        }

        return { orderId };
    }
});

export const getLastOrders = query({
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
            .first();

        if (orders) {
            const orderItems = await ctx.db.query('orderItem')
                .withIndex('byOrderId', (q) => q.eq('orderId', orders._id))
                .order('desc')
                .first();

            if (!orderItems) {
                throw new Error('No order items found');
            }

            const products = await ctx.db.query('product')
                .filter((q) => q.eq(q.field('_id'), orderItems.productId))
                .collect();

            return { orders, orderItems, products };

        } else {
            // Handle the case where no order was found
            console.log('No order found');
        }
    }
});
