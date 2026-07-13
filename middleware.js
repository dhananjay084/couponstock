import { NextResponse } from "next/server";
import { getConfiguredDefaultCountryCode, isCountryCodeSegment } from "./src/lib/countryPath";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/country") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  if (isCountryCodeSegment(firstSegment)) {
    return NextResponse.next();
  }

  const defaultCountryCode = getConfiguredDefaultCountryCode();
  if (!defaultCountryCode) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultCountryCode}` : `/${defaultCountryCode}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|uploads).*)"],
};
