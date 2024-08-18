import { product } from './../src/app/dashboard/products/columns';
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from './_generated/dataModel';
import {
    getAll,
    getOneFrom,
    getManyFrom,
    getManyVia,
} from "convex-helpers/server/relationships";

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

            // update product quantity
            // await ctx.db.patch("product", {
            //     _id: item.productId,
            //     quantity: product.quantity - item.quantity,
            // });
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
    }
});

export const getOrdersTotalPrice = query({
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

        return orders.reduce((acc, order) => acc + order.totalPrice, 0);
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

        // console.log('orders', orders)

        if (orders) {
            const orderItems = await ctx.db.query('orderItem')
                .withIndex('byOrderId', (q) => q.eq('orderId', orders._id))
                .order('desc')
                .first();

            // console.log('orderItems', orderItems)

            if (!orderItems) {
                throw new Error('No order items found');
            }

            const orderItemProducts = await ctx.db.query('orderItem')
                .withIndex('byOrderId', (q) => q.eq('orderId', orders._id))
                .collect();

            console.log('orderItemProducts', orderItemProducts.filter(item => item.quantity))

            const productsQuantity = orderItemProducts.reduce((acc, item) => acc + item.quantity, 0);
            const productsPrice = orderItemProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

            let products = [];

            for (const orderItem of orderItemProducts) {
                const product = await ctx.db.query('product')
                    .filter((q) => q.eq(q.field('_id'), orderItem.productId))
                    .first();
                products.push(product);
            }

            // console.log('products', products);

            const customer = await ctx.db.query('customer')
                .filter((q) => q.eq(q.field('_id'), orders.customerId))
                .first();

            // console.log('customer', customer);

            return { orders, orderItems, products, customer };
        } else {
            // Handle the case where no order was found
            console.log('No order found');
        }
    }
});

export const getOrdersWithCustomer = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("order")
            .withIndex("byOrganizationId", (q) => q.eq("organizationId", args.organizationId))
            .collect();

        const ordersWithCustomers = await Promise.all(
            orders.map(async (order) => {
                const customer = await ctx.db.get(order.customerId);
                return {
                    ...order,
                    customer,
                };
            })
        );

        console.log('ordersWithCustomers', ordersWithCustomers);

        return ordersWithCustomers;
    },
});


export const getOrdersInSpecDuration = query({
    args: {
        organizationId: v.string(),
        duration: v.union(v.literal('last7days'), v.literal('last30days'), v.literal('last90days')),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const durationInDays = {
            'last7days': 7,
            'last30days': 30,
            'last90days': 90,
        }[args.duration];

        if (durationInDays === undefined) {
            throw new Error('Invalid duration');
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - durationInDays);

        const orders = await ctx.db
            .query('order')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.gte('orderDate', startDate.toISOString()))
            .order('desc')
            .collect();

        console.log(`orders${durationInDays}days`, orders);
        return orders;
    }
});

// export const getOrdersInSpecStatus = query({
//     args: {
//         organizationId: v.string(),
//         status: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("Not authorized");
//         }

//         switch (args.status) {
//             case 'pending':
//                 const orders = await ctx.db.query('order')
//                     .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
//                     .filter((q) => q.eq('status', 'pending'))
//                     .order('desc')
//                     .first();
//                 return orders;
//             case 'shipped':
//                 const orders = await ctx.db.query('order')
//                     .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
//                     .filter((q) => q.eq('status', 'shipped'))
//                     .order('desc')
//                     .first();
//                 return orders;
//             case 'delivered':
//                 const orders = await ctx.db.query('order')
//                     .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
//                     .filter((q) => q.eq('status', 'delivered'))
//                     .order('desc')
//                     .first();
//                 return orders;
//             case 'cancelled':
//                 const orders = await ctx.db.query('order')
//                     .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
//                     .filter((q) => q.eq('status', 'cancelled'))
//                     .order('desc')
//                     .first();
//                 return orders;
//             default:
//                 throw new Error('Invalid status');
//         }
//     }
// });
