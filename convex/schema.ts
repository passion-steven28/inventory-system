import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),
    }),
    // clerk organizations
    organization: defineTable({
        clerkOrgId: v.string(),
        name: v.string(),
    }),
    product: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.optional(v.string()),
        quantity: v.number(),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        status: v.optional(v.string()),
        organizationId: v.string(),
        userId: v.optional(v.string()),
    }).index("organizationId", ["organizationId"])
        .index("userId", ["userId"])
        .index("categoryId", ["category"])
        .index("subCategoryId", ["subCategory"])
    ,
    category: defineTable({
        name: v.string(),
        description: v.string(),
        organizationId: v.string(),
    }).index("name", ["name"])
    .index("organizationId", ["organizationId"])
    ,
    subcategory: defineTable({
        categoryId: v.string(),
        name: v.string(),
        description: v.string(),
        organizationId: v.string(),
    }).index("categoryId", ["categoryId"])
    .index("name", ["name"])
    ,
    Supplier: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }),
    customer: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }),
    order: defineTable({
        productId: v.string(),
        items: v.array(v.string()),
        quantity: v.number(),
        price: v.number(),
        status: v.string(),
        customerId: v.string(),
        organizationId: v.string(),
    }),
    orderItem: defineTable({
        productId: v.string(),
        quantity: v.number(),
        price: v.number(),
        orderId: v.string(),
    }),
    inventory: defineTable({
        productId: v.string(),
        quantity: v.number(),
        organizationId: v.string(),
        lastUpdated: v.number(),
    }),
})