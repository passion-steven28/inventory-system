'use server'

import { redirect } from 'next/navigation'

export const useRedirect = (id: string) => {
    redirect(`/dashboard/products/${id}`);
};

export const useEdit = (id: string) => {
    redirect(`/products/${id}`);
};

export const useDelete = (id: string) => {
    redirect(`/products/${id}`);
};