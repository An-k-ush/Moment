import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "moment_token";

// Routes that require authentication
const protectedApiPatterns = [
  /^\/api\/streams\/[^/]+$/,  // PATCH /api/streams/:id
  /^\/api\/chat$/,            // POST /api/chat
];

// Routes that are always public
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/me",
  "/api/streams",
  "/api/users/search",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if it's a protected API route
  const isProtectedApi = protectedApiPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (isProtectedApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // Allow all other routes (dynamic user pages, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
