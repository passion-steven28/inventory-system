'use server'

import { createProduct } from "../../../convex/product";

export const test = async (data: FormData) => {
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const price = data.get('price') as string;
    const imageUrl = data.get('imageUrl') as string;
    const quantity = data.get('quantity') as string;
    const category = data.get('category') as string;
    const tags = data.get('tags') as string;
    
    await runMutation(createProduct, {
        name,
        description,
        price,
        imageUrl,
        quantity,
        category,
        tags,
        organizationId: 'org_2jnoR2jQ9ZDNMIybFTH1KcY8AJ1',
        userId: 'user_2jnoR2jQ9ZDNMIybFTH1KcY8AJ1',
    });
}