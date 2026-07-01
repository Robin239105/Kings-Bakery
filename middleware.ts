import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin dashboard pages (excluding login itself)
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      // Redirect to login page if no token exists
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated admin users away from the login page
  if (path === "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;
    if (token) {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Match all admin dashboard page routes
export const config = {
  matcher: ["/admin/:path*"],
};
