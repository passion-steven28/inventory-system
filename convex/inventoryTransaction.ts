import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createInventoryTransaction = mutation({
    args: {
        productId: v.string(),
        inventoryId: v.string(),
        quantity: v.number(),
        type: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const inventoryTransactionId = await ctx.db.insert("inventoryTransaction", {
            productId: args.productId,
            inventoryId: args.inventoryId,
            quantity: args.quantity,
            type: args.type,
            organizationId: args.organizationId,
            lastUpdated: Date.now()
        });

        let newQuantity = 0;
        // fetch inventory based on productId
        const inventory = await ctx.db.query("inventory")
            .withIndex("byProductId", (q) => q.eq("productId", args.productId))
            .unique();

        if (!inventory) {
            return;
        }

        switch (args.type) {
            case "purchase":
                newQuantity = inventory.quantity - args.quantity;
                break;
            case "sale":
                newQuantity = inventory.quantity + args.quantity;
                break;
            default:
                break;
        }


        // update inventory
        // await ctx.db.patch(args.inventoryId, {
        //     quantity: newQuantity,
        //     lastUpdated: Date.now()
        // });

        return { productId: args.productId, inventoryId: args.inventoryId };
    },
});