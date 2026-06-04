import { splitCountryPrefix } from "./countryPath";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");

const HREFLANG_BY_COUNTRY = {
  in: "en-IN",
  uk: "en-GB",
  us: "en-US",
  de: "en-DE",
  fr: "en-FR",
  es: "en-ES",
  pt: "en-PT",
};

const HREFLANG_LISTING_BASE_PATHS = new Set(["/", "/store", "/deal", "/deals", "/category"]);

const normalizePathname = (pathname = "/") => {
  const cleanPath = String(pathname || "/").split("?")[0].split("#")[0] || "/";
  if (cleanPath === "/") return "/";
  return cleanPath.replace(/\/+$/, "") || "/";
};

export const buildCanonicalUrl = (pathname = "/") => {
  const normalized = normalizePathname(pathname);
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
};

export const getHrefLangLinks = (pathname = "/") => {
  const normalized = normalizePathname(pathname);
  const { basePath } = splitCountryPrefix(normalized);

  if (!HREFLANG_LISTING_BASE_PATHS.has(basePath)) {
    return [];
  }

  return [
    { hrefLang: "en-IN", href: buildCanonicalUrl(basePath) },
    { hrefLang: "en-GB", href: buildCanonicalUrl(`/uk${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "en-US", href: buildCanonicalUrl(`/us${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "en-DE", href: buildCanonicalUrl(`/de${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "en-FR", href: buildCanonicalUrl(`/fr${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "en-ES", href: buildCanonicalUrl(`/es${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "en-PT", href: buildCanonicalUrl(`/pt${basePath === "/" ? "" : basePath}`) },
    { hrefLang: "x-default", href: buildCanonicalUrl(basePath) },
  ];
};

export const buildMetadataAlternates = (pathname = "/") => {
  const links = getHrefLangLinks(pathname);
  const languages = links
    .filter((link) => link.hrefLang !== "x-default")
    .reduce((acc, link) => {
      acc[link.hrefLang] = link.href;
      return acc;
    }, {});

  const defaultLink = links.find((link) => link.hrefLang === "x-default");

  return {
    canonical: buildCanonicalUrl(pathname),
    ...(Object.keys(languages).length > 0 ? { languages } : {}),
    ...(defaultLink ? { "x-default": defaultLink.href } : {}),
  };
};
