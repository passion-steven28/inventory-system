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
        category: v.optional(v.id('category')),
        subCategory: v.optional(v.id('subcategory')),
        userId: v.optional(v.string()),
        organizationId: v.string(),
        brandId: v.optional(v.id('brand')),
        tags: v.optional(v.array(v.id('tag'))),
        productMetrics: v.optional(v.id('product_metrics')),
        propertyId: v.optional(v.array(v.id('property'))),
    }).index("byOrganizationId", ["organizationId"])
        .index("userId", ["userId"])
        .index("categoryId", ["organizationId", "category"]) // Compound index
        .index("subCategoryId", ["organizationId", "subCategory"]) // Compound index
        .index("byName", ["organizationId", "productName"]) // Index for searching by name
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
        .index("byEmail", ["organizationId", "email"]) // Compound index
        .index("byName", ["organizationId", "supplierName"]), // Index for searching by name


    customer: defineTable({
        customerName: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        organizationId: v.string(),
    }).index("byOrganizationId", ["organizationId"])
        .index("byEmail", ["organizationId", "email"]) // Compound index
        .index("byName", ["organizationId", "customerName"]), // Index for searching by name


    order: defineTable({
        customerId: v.id('customer'), // many to many
        organizationId: v.string(), // many to one
        status: v.string(),
        totalPrice: v.optional(v.number()), // sum of orderItems.price
        orderDate: v.string(), // or v.number() if you're using timestamps
    }).index("byOrganizationId", ["organizationId"])
        .index("byCustomerId", ["organizationId", "customerId"]) // Compound index
        .index("byStatus", ["organizationId", "status"]) // Index for filtering by status
        .index("byDate", ["organizationId", "orderDate"]), // Index for sorting/filtering by date


    orderItem: defineTable({
        orderId: v.id('order'), // many to one
        productId: v.id('product'), // Reference the actual product
        quantity: v.number(),
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
    }).index("byProductId", ["organizationId", "productId"]) // Compound index
        .index("bySupplierId", ["organizationId", "supplierId"]) // Compound index
        .index("byOrganizationId", ["organizationId"])
    ,

    inventory_adjustment: defineTable({
        productId: v.id('product'),
        inventoryId: v.id('inventory'),
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
        inventoryId: v.id('inventory'),
        quantity: v.number(),
        price: v.number(),
        type: v.string(),
        organizationId: v.string(),
        lastUpdated: v.optional(v.number()),
    })
        .index("byOrganizationId", ["organizationId"])
        .index("byInventoryId", ["inventoryId"])
        .index("byType", ["type"]),

    analytics: defineTable({
        organizationId: v.string(),
        totalSales: v.number(),
        totalExpenses: v.number(),
        totalRevenue: v.number(),
        totalProfit: v.number(),
        totalCost: v.number(),
    })
        .index("byOrganizationId", ["organizationId"]),

    expenses: defineTable({
        organizationId: v.string(),
        type: v.id('expense_type'),
        amount: v.number(),
        description: v.optional(v.string()),
        createdAt: v.optional(v.number()),
    })
        .index("byOrganizationId", ["organizationId"]),

    expense_type: defineTable({
        organizationId: v.string(),
        type: v.string(),
        description: v.string(),
    })
        .index("byOrganizationId", ["organizationId"])
        .index("byType", ["type"]),
})