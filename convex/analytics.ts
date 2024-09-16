import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from './_generated/dataModel';

export const getAnalytics = mutation({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx: QueryCtx, args) => {
        const { organizationId } = args;
        if (!organizationId) {
            throw new Error("Organization id is required");
        }

        const analytics = await ctx.db.query('analytics')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .unique()
        
        return analytics;
    },
});

export const getAnalyticsTotalNetProfit = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const analytics = await ctx.db.query('analytics')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .first();
        
        console.log(analytics);

        if (analytics) {
            const grossProfit = analytics.totalRevenue - analytics.totalCost;
            const netProfit = grossProfit - analytics.totalExpenses;
            return {netProfit, grossProfit};
        } else {
            return 0;
        }
    },
});

export const getAnalyticsTotalRevenue = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const analytics = await ctx.db.query('analytics')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .first();

        if (analytics) {
            return analytics.totalRevenue;
        } else {
            return 0;
        }
    },
});