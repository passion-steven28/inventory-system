import { product } from './../src/app/dashboard/products/columns';
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
        productName: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        category: v.optional(v.string()),
        subCategory: v.optional(v.string()),
        userId: v.optional(v.string()),
        organizationId: v.string(),
        brandId: v.optional(v.id('brand')),
        tags: v.optional(v.array(v.id('tag'))),
        productMetrics: v.optional(v.id('product_metrics')),
        propertyId: v.optional(v.array(v.id('property'))),
    }).index("byOrganizationId", ["organizationId"])
        .index("userId", ["userId"])
        .index("categoryId", ["category"])
        .index("subCategoryId", ["subCategory"])
    ,

    product_metrics: defineTable({
        productId: v.id('product'),
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
        totalSales: v.optional(v.number()),
        weeklySales: v.optional(v.number()),
        monthlySales: v.optional(v.number()),
        yearlySales: v.optional(v.number()),
    }),

    property: defineTable({
        propertyName: v.string(),
        value: v.union(v.string(), v.number()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("propertyName", ["propertyName"])
    ,

    brand: defineTable({
        brandName: v.string(),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("brandName", ["brandName"])
    ,

    tag: defineTable({
        tagName: v.string(),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("tagName", ["tagName"])
    ,


    category: defineTable({
        categoryName: v.string(),
        organizationId: v.string(),
    }).index("categoryName", ["categoryName"])
        .index("organizationId", ["organizationId"])
    ,


    subcategory: defineTable({
        subCategoryName: v.string(),
        categoryId: v.id('category'),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("subCategoryName", ["subCategoryName"])
        .index("categoryId", ["categoryId"])
    ,



    supplier: defineTable({
        supplierName: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("byEmail", ["email"]),
    
    
    customer: defineTable({
        customerName: v.string(),
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
        organizationId: v.string(),
        productId: v.id('product'),
        supplierId: v.id('supplier'),
        buyingPrice: v.optional(v.number()),
        sellingPrice: v.optional(v.number()),
        status: v.optional(v.string()),
        minStockThreshold: v.optional(v.number()),
        openStock: v.number(),
        currentStock: v.optional(v.number()),
        createdAt: v.optional(v.number()),
        lastUpdated: v.optional(v.number()),
    }).index("byProductId", ["productId"])
        .index("bySupplierId", ["supplierId"])
        .index("byOrganizationId", ["organizationId"])
    ,

    inventory_adjustment: defineTable({
        productId: v.string(),
        inventoryId: v.string(),
        quantity: v.number(),
        type: v.string(),
        description: v.optional(v.string()),
        organizationId: v.string(),
        lastUpdated: v.optional(v.number()),
    })
        .index("byProductId", ["productId"])
        .index("byOrganizationId", ["organizationId"])
        .index("byInventoryId", ["inventoryId"]),


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