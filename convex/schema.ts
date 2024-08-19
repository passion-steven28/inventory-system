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
        description: v.optional(v.string()),
        buyingPrice: v.optional(v.number()),
        sellingPrice: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        quantity: v.number(),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        status: v.optional(v.string()),
        minStockThreshold: v.optional(v.number()),
        currentStock: v.optional(v.number()),
        propertyId: v.optional(v.array(v.id('property'))),
        brandId: v.optional(v.id('brand')),
        tags: v.optional(v.array(v.id('tag'))),
        organizationId: v.string(),
        userId: v.optional(v.string()),
    }).index("byOrganizationId", ["organizationId"])
        .index("userId", ["userId"])
        .index("categoryId", ["category"])
        .index("subCategoryId", ["subCategory"])
    ,

    property: defineTable({
        name: v.string(),
        value: v.union(v.string(), v.number()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("name", ["name"])
    ,

    brand: defineTable({
        name: v.string(),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("name", ["name"])
    ,

    tag: defineTable({
        name: v.string(),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("name", ["name"])
    ,


    category: defineTable({
        name: v.string(),
        organizationId: v.string(),
    }).index("name", ["name"])
        .index("organizationId", ["organizationId"])
    ,


    subcategory: defineTable({
        name: v.string(),
        categoryId: v.id('category'),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("name", ["name"])
        .index("categoryId", ["categoryId"])
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
        customerId: v.id('customer'), // many to many
        organizationId: v.string(), // many to one
        status: v.string(),
        totalPrice: v.number(),
        orderDate: v.string(), // or v.number() if you're using timestamps
    }).index("byOrganizationId", ["organizationId"])
        .index("byCustomerId", ["customerId"]),
    
    
    orderItem: defineTable({
        orderId: v.id('order'), // many to one
        productId: v.id('product'), // many to many
        quantity: v.number(),
        price: v.number(),
        organizationId: v.string(),
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
})