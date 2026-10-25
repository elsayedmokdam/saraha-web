import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/confirm-email"];
const PROTECTED_ROUTES = [
  "/messages",
  "/identity-requests",
  "/conversations",
  "/profile",
  "/u",
];
const ADMIN_ROUTES = ["/admin"];

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = req.nextUrl;

  // A session whose API tokens could not be refreshed counts as signed out
  const isAuth: boolean = !!token && !token.error;
  const isAdmin: boolean = isAuth && token?.role === 1;

  const isAuthPage = AUTH_ROUTES.some((route) => matches(pathname, route));
  const isProtected = PROTECTED_ROUTES.some((route) => matches(pathname, route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => matches(pathname, route));

  // Not authenticated + protected page => signin (and come back afterwards)
  if (!isAuth && (isProtected || isAdminRoute)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // Authenticated but not an admin => home
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Authenticated user on signin / signup / ... => home
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Run only on the routes above (not on static files or /api)
export const config = {
  matcher: [
    "/messages/:path*",
    "/identity-requests/:path*",
    "/conversations/:path*",
    "/profile/:path*",
    "/u/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/confirm-email",
  ],
};
