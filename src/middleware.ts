import { RedirectToCreateOrganization } from '@clerk/nextjs';
import {
    clerkMiddleware,
    createRouteMatcher
} from '@clerk/nextjs/server';
import { redirect } from 'next/dist/server/api-utils';

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
    const orgId = auth().orgId;
    if (!orgId) console.log('no org id');
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};