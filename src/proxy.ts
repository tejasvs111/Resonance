import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]); // This creates a function eg. isPublicRoute(req) and return true/false

const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]); // Users without an organization should still be able to access the organization selection page.

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!userId) {
    await auth.protect(); // auth.protect() check krte loggin ahe ky trr nasla trr redirect to sign-in
  }

  // Allow oganization pages
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
  }

  // For all protected routes, ensure org is selected

  if (userId && !orgId) {
    const orgSelection = new URL("/org-selection", req.url); // manje dusre konche url asla trr org-selection url vrr redirect honar

    // this => new URL("/about", "https://example.com/dashboard")
    // to this => https://example.com/about

    return NextResponse.redirect(orgSelection);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
