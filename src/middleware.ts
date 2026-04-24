// ============================================================
// MIDDLEWARE
// Protects routes that require authentication
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/checkout", "/orders"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Auth check will be handled client-side via AuthProvider
    // Middleware just ensures the route is accessible
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
