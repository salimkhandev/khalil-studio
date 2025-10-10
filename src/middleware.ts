import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAuth = request.cookies.get("admin_auth");

  // Allow the login page to load without a cookie; if already authenticated, send to panel
  if (pathname.startsWith("/login")) {
    if (adminAuth) {
      const toPanel = request.nextUrl.clone();
      toPanel.pathname = "/panel";
      return NextResponse.redirect(toPanel);
    }
    return NextResponse.next();
  }

  // Protect other /admin routes
  if (pathname.startsWith("/panel")) {
    if (!adminAuth) {
      const toLogin = request.nextUrl.clone();
      toLogin.pathname = "/login"; // hidden admin route group
      return NextResponse.redirect(toLogin);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/login"],
};


