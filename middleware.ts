import { NextRequest, NextResponse } from "next/server";

// Middleware to support path tenant mode: /w/:slug/* and /api/w/:slug/*
// - Injects x-workspace-slug header
// - Rewrites path by stripping the /w/:slug or /api/w/:slug segment
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);

  // /w/:slug/* -> inject header and rewrite to /*
  if (parts[0] === "w" && parts.length >= 2) {
    const slug = parts[1];
    const rest = "/" + parts.slice(2).join("/");
    const headers = new Headers(req.headers);
    headers.set("x-workspace-slug", slug);
    url.pathname = rest || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // /api/w/:slug/* -> /api/*
  if (parts[0] === "api" && parts[1] === "w" && parts.length >= 3) {
    const slug = parts[2];
    const rest = "/api/" + parts.slice(3).join("/");
    const headers = new Headers(req.headers);
    headers.set("x-workspace-slug", slug);
    url.pathname = rest || "/api";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/w/:path*", "/api/w/:path*"],
};
