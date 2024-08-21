import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createCategory = mutation({
    args: {
        categoryName: v.string(),
        subCategory: v.optional(v.array(v.string())),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }


        const category = await ctx.db.insert("category", {
            categoryName: args.categoryName,
            organizationId: args.organizationId,
        }).then(async (res) => {
            if (args.subCategory) {
                for (const subCategory of args.subCategory) {
                    await ctx.db.insert("subcategory", {
                        subCategoryName: subCategory,
                        categoryId: res,
                        organizationId: args.organizationId,
                    });
                }
            }
        });
    },
});

export const getCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('category')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories;
    },
});

export const getCategoryByName = query({
    args: {
        categoryName: v.string(),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const category = await ctx.db.query('category')
            .withIndex('organizationId', (q) => q.eq('organizationId', args.organizationId))
            .filter((q) => q.eq(q.field('categoryName'), args.categoryName))
            .unique()

        return category;
    },
});

export const getTotalCategories = query({
    args: {
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authorized");
        }

        const categories = await ctx.db.query('category')
            .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
            .collect();

        return categories.length;
    },
});