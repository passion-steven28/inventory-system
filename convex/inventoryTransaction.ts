import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createInventoryTransaction = mutation({
    args: {
        productId: v.id('product'),
        inventoryId: v.id('inventory'),
        quantity: v.number(),
        type: v.union(v.literal("purchase"), v.literal("sale")),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        // Fetch the current inventory
        const inventory = await ctx.db
            .query("inventory")
            .withIndex("byProductId", (q) => q.eq("productId", args.productId))
            .unique();

        if (!inventory) {
            throw new Error("Inventory not found for the given product");
        }

        // Calculate the new quantity
        let newQuantity = inventory.quantity;
        switch (args.type) {
            case "purchase":
                newQuantity += args.quantity;
                break;
            case "sale":
                newQuantity -= args.quantity;
                if (newQuantity < 0) {
                    throw new Error("Insufficient inventory for sale");
                }
                break;
        }

        // Create the inventory transaction
        const inventoryTransactionId = await ctx.db.insert("inventoryTransaction", {
            productId: args.productId,
            inventoryId: args.inventoryId,
            quantity: args.quantity,
            type: args.type,
            organizationId: args.organizationId,
            lastUpdated: Date.now()
        });

        // Update the inventory
        await ctx.db.patch(args.inventoryId, {
            quantity: newQuantity,
            lastUpdated: Date.now()
        });

        // Fetch the updated inventory
        const updatedInventory = await ctx.db.get(args.inventoryId);

        return {
            inventoryTransactionId,
            productId: args.productId,
            inventoryId: args.inventoryId,
            newQuantity: updatedInventory?.quantity ?? newQuantity
        };
    },
});