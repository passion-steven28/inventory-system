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
                productId: v.id('inventory'),
                quantity: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Fetch all necessary product prices before the loop
        let productPrices = [];
        for (const item of args.orderItems) {
            const product = await ctx.db.get(item.productId);
            if (product) {
                productPrices.push(product.sellingPrice);
            }
        }

        // calculate totalPrice
        if (productPrices) {
            productPrices = productPrices.filter(price => price !== undefined);
        }
        const totalPrice = productPrices.reduce((acc, price) => acc + price, 0);

        // Insert the order
        const orderId = await ctx.db.insert("order", {
            customerId: args.customerId,
            organizationId: args.organizationId,
            status: args.status,
            totalPrice,
            orderDate: new Date().toISOString(),
        });

        // Update the inventory analysis
        const analyticsId = await ctx.db.query('analytics')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .first();
        
        if (analyticsId) {
            const revenue = totalPrice * args.orderItems.length;
            const profit = revenue - totalPrice;
            console.log('revenue', revenue, args.orderItems.length);
            await ctx.db.patch(analyticsId._id, {
                totalSales: analyticsId.totalSales + totalPrice,
                totalRevenue: analyticsId.totalRevenue + totalPrice * args.orderItems.length,
            });
        }

        // Then, in your loop, use the pre-fetched prices
        for (const item of args.orderItems) {
            await ctx.db.insert("orderItem", {
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                organizationId: args.organizationId,
            });

            // update the inventory current stock
            const inventory = await ctx.db.query('inventory')
                .filter((q) => q.eq(q.field('_id'), item.productId))
                .first();

            if (inventory?.currentStock) {
                await ctx.db.patch(inventory._id, {
                    currentStock: inventory.currentStock - item.quantity,
                });
            }
        }

        return orderId;
    },
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

        return orders
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

            // const productsQuantity = orderItemProducts.reduce((acc, item) => acc + item.quantity, 0);
            // const productsPrice = orderItemProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

            let products = [];

            for (const orderItem of orderItemProducts) {
                const inventorProduct = await ctx.db.query('inventory')
                    .filter((q) => q.eq(q.field('_id'), orderItem.productId))
                    .first();
                
                if (inventorProduct) {
                    const product = await ctx.db.get(inventorProduct.productId);
                    products.push(product);
                }
            }

            // console.log('products', products);

            const customer = await ctx.db.query('customer')
                .filter((q) => q.eq(q.field('_id'), orders.customerId))
                .first();

            // console.log('customer', customer);

            return { orders, products,  customer };
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
