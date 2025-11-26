import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isPublicPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/landing");

    // If logged in and trying to access auth pages, redirect to dashboard
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow public pages
    if (isPublicPage) {
      return NextResponse.next();
    }

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard") && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/landing")) {
          return true;
        }
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // Allow auth pages
        if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
          return true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
