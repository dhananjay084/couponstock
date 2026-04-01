import { NextResponse } from "next/server";
import { isCountryCodeSegment } from "./src/lib/countryPath";

const NO_COUNTRY_PREFIX_PATHS = ["/about", "/contact", "/blogs", "/blog", "/privacy", "/terms"];

const isNoCountryPrefixPath = (pathname = "/") =>
  NO_COUNTRY_PREFIX_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 1) return NextResponse.next();

  const first = segments[0];
  if (!isCountryCodeSegment(first)) return NextResponse.next();

  const baseSegments = segments.slice(1);
  const url = req.nextUrl.clone();
  url.pathname = `/${baseSegments.join("/")}` || "/";
  if (url.pathname === "") url.pathname = "/";

  if (first.toLowerCase() === "in") {
    return NextResponse.redirect(url);
  }
  if (isNoCountryPrefixPath(url.pathname)) {
    return NextResponse.redirect(url);
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
