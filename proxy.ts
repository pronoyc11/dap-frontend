import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/dashboard", "/provider", "/settings"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!protectedPrefixes.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  const role = request.cookies.get("dap-auth")?.value;
  if (!role) {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(path)}`, request.url),
    );
  }

  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  if (path.startsWith("/provider") && role !== "RECRUITER") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  if (path.startsWith("/dashboard") && role !== "CANDIDATE") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/provider/:path*", "/settings/:path*"],
};
