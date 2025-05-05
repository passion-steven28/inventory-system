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
                productId: v.id('product'), // Changed from inventory ID to product ID
                quantity: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        let calculatedTotalPrice = 0;
        const inventoryUpdates: { inventoryId: Id<'inventory'>, quantityChange: number }[] = [];
        const orderItemInserts: any[] = []; // Store args for orderItem inserts

        // Process items to find inventory, calculate price, and prepare updates
        for (const item of args.orderItems) {
            // Find the corresponding inventory item for the product
            // Assuming one active inventory record per product for simplicity
            const inventoryItem = await ctx.db
                .query('inventory')
                .filter(q => q.eq(q.field('productId'), item.productId))
                .filter(q => q.eq(q.field('organizationId'), args.organizationId))
                // Add more filters if needed (e.g., status = 'active')
                .first();

            if (!inventoryItem) {
                throw new Error(`Inventory not found for product ID: ${item.productId}`);
            }
            if (inventoryItem.currentStock === undefined || inventoryItem.currentStock === null || inventoryItem.currentStock < item.quantity) {
                throw new Error(`Insufficient stock for product ID: ${item.productId}. Available: ${inventoryItem.currentStock ?? 0}, Required: ${item.quantity}`);
            }
            if (inventoryItem.sellingPrice === undefined || inventoryItem.sellingPrice === null) {
                throw new Error(`Selling price not set for inventory of product ID: ${item.productId}`);
            }

            calculatedTotalPrice += item.quantity * inventoryItem.sellingPrice;
            inventoryUpdates.push({ inventoryId: inventoryItem._id, quantityChange: -item.quantity });
            orderItemInserts.push({
                // orderId will be set after order insertion
                productId: item.productId, // Store product ID in orderItem
                quantity: item.quantity,
                organizationId: args.organizationId,
                // Optionally store price per item at time of order
                pricePerItem: inventoryItem.sellingPrice 
            });
        }

        // Insert the order
        const orderId = await ctx.db.insert("order", {
            customerId: args.customerId,
            organizationId: args.organizationId,
            status: args.status,
            totalPrice: calculatedTotalPrice, // Use correctly calculated total price
            orderDate: new Date().toISOString(),
        });

        // Insert order items
        for (const orderItemArg of orderItemInserts) {
            await ctx.db.insert("orderItem", {
                ...orderItemArg,
                orderId: orderId, // Set the orderId now
            });
        }

        // Update inventory stock
        for (const update of inventoryUpdates) {
            const currentInventory = await ctx.db.get(update.inventoryId);
            if (currentInventory && currentInventory.currentStock !== undefined && currentInventory.currentStock !== null) {
                await ctx.db.patch(update.inventoryId, {
                    currentStock: currentInventory.currentStock + update.quantityChange,
                    lastUpdated: Date.now()
                });
            }
        }

        // Update analytics
        const analyticsRecord = await ctx.db.query('analytics')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .first();
        
        if (analyticsRecord) {
            await ctx.db.patch(analyticsRecord._id, {
                totalSales: (analyticsRecord.totalSales ?? 0) + 1, // Increment sales count
                totalRevenue: (analyticsRecord.totalRevenue ?? 0) + calculatedTotalPrice, // Add revenue
                // Note: Profit calculation is complex and better handled separately or via scheduled tasks
            });
        } else {
             // Optionally create analytics record if it doesn't exist
             await ctx.db.insert('analytics', {
                organizationId: args.organizationId,
                totalSales: 1,
                totalRevenue: calculatedTotalPrice,
                totalExpenses: 0,
                totalCost: 0,
                totalProfit: 0, // Initialize profit
             });
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
                    .filter(q => q.eq(q.field('productId'), orderItem.productId))
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
