import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from './_generated/dataModel';
import {
    getAll,
    getOneFrom,
    getManyFrom,
    getManyVia,
} from "convex-helpers/server/relationships";

export const createExpense = mutation({
    args: {
        organizationId: v.string(),
        type: v.id('expense_type'),
        amount: v.number(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const date = new Date();

        // Create an expense entry
        const expenseId = await ctx.db.insert("expenses", {
            organizationId: args.organizationId,
            type: args.type,
            amount: args.amount,
            description: args.description,
            createdAt: Number(date),
        }).then(async (expenseId) => {
            // Update the inventory analysis
            const analyticsId = await ctx.db.query('analytics')
                .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
                .first()
            
            const expenses = await ctx.db.get(expenseId);

            if(analyticsId && expenses) {
                await ctx.db.patch(analyticsId._id, {
                    totalExpenses: analyticsId.totalExpenses + expenses.amount,
                });
            }
        });

        return expenseId;
    },
});

export const getExpenses = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const expenses = await ctx.db.query('expenses')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .collect();

        return expenses;
    },
});

export const getExpensesByType = query({
    args: {
        organizationId: v.string(),
        type: v.id('expense_type'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const expenses = await ctx.db.query('expenses')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('type'), args.type))
            .collect();

        return expenses;
    },
});