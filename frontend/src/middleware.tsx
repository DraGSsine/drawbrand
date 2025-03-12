import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const PROTECTED_ROUTES = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAuthenticated = await verifyToken(token);
  const isProtected = isProtectedRoute(pathname);

  if (isProtected && !isAuthenticated) {
    return redirectTo("/auth/signin", req);
  }

  if (!isProtected && isAuthenticated) {
    return redirectTo("/dashboard", req);
  }

  return NextResponse.next();
}

const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.some((path) => pathname.startsWith(path));

const verifyToken = async (token?: string): Promise<boolean> => {
  if (!token) return false;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is missing from environment variables");
    return false;
  }

  try {
    await jose.jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch (error) {
    console.warn("Invalid token:", error);
    return false;
  }
};

const redirectTo = (path: string, req: NextRequest) => {
  return NextResponse.redirect(new URL(path, req.url));
};

export const config = {
  matcher: ["/dashboard", "/auth/signin", "/auth/signup", "/"],
};
