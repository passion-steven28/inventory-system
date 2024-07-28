// src/app/dashboard/products/useDeleteProduct.ts

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const useDeleteProduct = () => {
    const mutateDelete = useMutation(api.product.deleteProduct);

    const deleteProduct = async (id: any) => {
        try {
            await mutateDelete({ id });
            // Handle success, e.g., show a notification or update the UI
        } catch (error) {
            // Handle error, e.g., show an error message
            console.error("Failed to delete product:", error);
        }
    };

    return deleteProduct;
};