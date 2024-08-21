import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { resolve } from "path";

export const createSubCategory = mutation({
    args: {
        subCategoryName: v.string(),
        categoryId: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        await ctx.db.insert("subcategory", {
            subCategoryName: args.subCategoryName,
            categoryId: args.categoryId as Id<"category">,
            organizationId: args.organizationId,
        });
    },
});

export const getSubCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories;
    },
});

export const getSubCategoryById = query({
    args: {
        organizationId: v.string(),
        categoryId: v.optional(v.id("category")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const category = await ctx.db.query('subcategory')
            .withIndex('byOrganizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('categoryId'), args.categoryId))
            .collect();

        return category;
    },
});

export const getTotalSubCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('subcategory')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories.length;
    },
});