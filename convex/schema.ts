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
        buyingPrice: v.optional(v.number()),
        sellingPrice: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        quantity: v.number(),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        status: v.optional(v.string()),
        minStockThreshold: v.optional(v.number()),
        currentStock: v.optional(v.number()),
        organizationId: v.string(),
        userId: v.optional(v.string()),
    }).index("byOrganizationId", ["organizationId"])
        .index("userId", ["userId"])
        .index("categoryId", ["category"])
        .index("subCategoryId", ["subCategory"])
    ,
    category: defineTable({
        name: v.string(),
        organizationId: v.string(),
    }).index("name", ["name"])
    .index("organizationId", ["organizationId"])
    ,
    subcategory: defineTable({
        name: v.string(),
        organizationId: v.string(),
    }).index("name", ["name"])
    ,
    supplier: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
    .index("byEmail", ["email"]),
    customer: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
    .index("byEmail", ["email"]),
    order: defineTable({
        productId: v.id('product'),
        items: v.array(v.object({
            productId: v.id('product'),
            quantity: v.number(),
            price: v.number(),
            orderId: v.id('order'),
        })),
        quantity: v.number(),
        price: v.number(),
        status: v.string(),
        customerId: v.id('customer'),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
    .index("byCustomerId", ["customerId"]),
    orderItem: defineTable({
        organizationId: v.string(),
        productId: v.id('product'),
        quantity: v.number(),
        price: v.number(),
        orderId: v.optional(v.string()),
    }).index("byOrganizationId", ["organizationId"])
        .index("byOrderId", ["orderId"])
    .index("byProductId", ["productId"]),
    inventory: defineTable({
        productId: v.string(),
        quantity: v.number(),
        organizationId: v.string(),
        lastUpdated: v.optional(v.number()),
    }).index("byProductId", ["productId"])
    .index("byOrganizationId", ["organizationId"])
    ,
    inventoryTransaction: defineTable({
        productId: v.string(),
        inventoryId: v.string(),
        quantity: v.number(),
        type: v.string(),
        organizationId: v.string(),
        lastUpdated: v.optional(v.number()),
    })
    .index("byProductId", ["productId"])
        .index("byOrganizationId", ["organizationId"])
    .index("byInventoryId", ["inventoryId"]),
    invoice: defineTable({
        orderId: v.string(),
        customerId: v.string(),
        organizationId: v.string(),
        status: v.string(),
        items: v.array(v.string()),
        total: v.number(),
        date: v.number(),
    }),
})