import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { USER_ROLES } from "@/features/auth/constants/user.constant";

const privateRoutes = new Set(["/dashboard", "/dashboard/profile", "/profile"]);
const authRoutes = new Set(["/login", "/register"]);
const adminRoles = new Set<string>([USER_ROLES.admin, USER_ROLES.superAdmin]);

export default async function proxy(request: NextRequest) {
  const jwt = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // User cannot access private routes without authentication
  // User cannot access auth routes if they are authenticated

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!jwt) {
      const redirectUrl = new URL("/login", request.nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (!adminRoles.has(jwt.user?.role)) {
      return NextResponse.redirect(new URL("/forbidden", request.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Dashboard route protection
  if (pathname.startsWith("/dashboard")) {
    if (!jwt) {
      const redirectUrl = new URL("/login", request.nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (jwt) return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  if (privateRoutes.has(pathname)) {
    if (jwt) return NextResponse.next();

    const redirectUrl = new URL("/login", request.nextUrl.origin);

    redirectUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (authRoutes.has(pathname)) {
    if (!jwt) return NextResponse.next();

    const redirectUrl = new URL("/dashboard", request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();

  // if (jwt) {
  //   /*
  //     1- Access private routes
  //     2- Access auth routes
  //     3- Access any other route (public)
  //   */

  //     if (privateRoutes.has(pathname)) return NextResponse.next();

  //     if (authRoutes.has(pathname)) {
  //       const redirectUrl = new URL('/dashboard', request.nextUrl.origin);

  //       return NextResponse.redirect(redirectUrl)
  //     }

  //     return NextResponse.next();
  // }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
