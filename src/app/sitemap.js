import { fetchJson } from "../lib/serverFetchJson";
import { ALLOWED_COUNTRY_CODES, getCountryCodeFromName } from "../lib/countryPath";
import { buildServerApiUrl } from "../lib/serverApi";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
const COUNTRY_PREFIX_CODES = ALLOWED_COUNTRY_CODES.filter((code) => code !== "in");

export const revalidate = 3600; // 1 hour

const NO_COUNTRY_PREFIX_ROUTES = ["/about", "/contact", "/blogs", "/privacy", "/terms"];

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/blogs",
  "/store",
  "/category",
  "/deal",
  "/deals",
  "/privacy",
  "/terms",
  "/submit-coupon",
  "/login",
  "/signup",
  "/profilep",
  "/payment",
];

async function getJson(path) {
  try {
    const data = await fetchJson(buildServerApiUrl(path), { next: { revalidate } });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function safeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function slugifySegment(value = "") {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function normalizeCountryCodes(value) {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return [...new Set(
    list
      .map((code) => getCountryCodeFromName(code) || String(code || "").trim().toLowerCase())
      .filter((code) => ALLOWED_COUNTRY_CODES.includes(code))
  )];
}

function withCountryVariants(pathname, countryCodes, entry, options = {}) {
  const normalizedCountryCodes = normalizeCountryCodes(countryCodes);
  const includeBaseRoute = options.includeBaseRoute !== false;
  const prefixedEntries = normalizedCountryCodes
    .filter((code) => code !== "in")
    .map((code) => ({
    ...entry,
    url: `${SITE_URL}/${code}${pathname}`,
  }));

  const baseEntries = includeBaseRoute
    ? [{ ...entry, url: `${SITE_URL}${pathname}` }]
    : [];

  return [...baseEntries, ...prefixedEntries];
}

export default async function sitemap() {
  const [stores, deals, categories, blogs, countries] = await Promise.all([
    getJson("/api/stores/sitemap"),
    getJson("/api/deals/sitemap"),
    getJson("/api/categories/sitemap"),
    getJson("/api/blogs/sitemap"),
    getJson("/api/countries/sitemap"),
  ]);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const countryCodeEntries = COUNTRY_PREFIX_CODES.flatMap((code) =>
    staticRoutes
      .filter((route) => !NO_COUNTRY_PREFIX_ROUTES.includes(route))
      .map((route) => ({
      url: `${SITE_URL}/${code}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.6,
    }))
  );

  const storeEntries = stores
    .filter((store) => store?.slug)
    .flatMap((store) =>
      withCountryVariants(
        `/store/${encodeURIComponent(store.slug)}`,
        store?.country,
        {
          lastModified: safeDate(store.updatedAt || store.createdAt),
          changeFrequency: "daily",
          priority: 0.8,
        },
        {
          includeBaseRoute: normalizeCountryCodes(store?.country).length === 0 ||
            normalizeCountryCodes(store?.country).includes("in"),
        },
      )
    );

  const categoryEntries = categories
    .filter((category) => category?.name)
    .flatMap((category) => {
      const slug = slugifySegment(category.name);
      return withCountryVariants(
        `/category/${encodeURIComponent(slug)}`,
        COUNTRY_PREFIX_CODES,
        {
          lastModified: safeDate(category.updatedAt || category.createdAt),
          changeFrequency: "weekly",
          priority: 0.7,
        }
      );
    });

  const blogEntries = blogs
    .filter((blog) => blog?._id)
    .flatMap((blog) => {
      const slug = `${slugifySegment(blog.heading || "blog")}--${blog._id}`;
      return withCountryVariants(
        `/blog/${encodeURIComponent(slug)}`,
        COUNTRY_PREFIX_CODES,
        {
          lastModified: safeDate(blog.updatedAt || blog.createdAt),
          changeFrequency: "weekly",
          priority: 0.7,
        }
      );
    });

  const countryEntries = countries
    .map((c) => ({
      name: (c?.country_name || c?.name || "").toString().trim(),
      updatedAt: c?.updatedAt,
      createdAt: c?.createdAt,
    }))
    .filter((c) => c.name)
    .flatMap((c) => {
      const slug = slugifySegment(c.name);
      return withCountryVariants(
        `/country/${encodeURIComponent(slug)}`,
        COUNTRY_PREFIX_CODES,
        {
          lastModified: safeDate(c.updatedAt || c.createdAt),
          changeFrequency: "weekly",
          priority: 0.6,
        }
      );
    });

  const entries = [
    ...staticEntries,
    ...countryCodeEntries,
    ...storeEntries,
    ...categoryEntries,
    ...blogEntries,
    ...countryEntries,
  ];

  return entries.filter(
    (entry, index, allEntries) =>
      allEntries.findIndex((candidate) => candidate.url === entry.url) === index
  );
}
