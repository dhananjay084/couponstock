import { fetchJson } from "../lib/serverFetchJson";
import { ALLOWED_COUNTRY_CODES } from "../lib/countryPath";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
const API_BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/$/, "");
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
  if (!API_BASE_URL) return [];
  try {
    const data = await fetchJson(`${API_BASE_URL}${path}`, { next: { revalidate } });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function safeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
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
    .map((store) => ({
      url: `${SITE_URL}/store/${encodeURIComponent(store.slug)}`,
      lastModified: safeDate(store.updatedAt || store.createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const dealEntries = deals
    .filter((deal) => deal?.slug || deal?._id)
    .map((deal) => ({
      url: `${SITE_URL}/deal/${encodeURIComponent(deal.slug || deal._id)}`,
      lastModified: safeDate(deal.updatedAt || deal.createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const categoryEntries = categories
    .filter((category) => category?.name)
    .map((category) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(
        category.name.toString().trim().toLowerCase()
      )}`,
      lastModified: safeDate(category.updatedAt || category.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const blogEntries = blogs
    .filter((blog) => blog?._id)
    .map((blog) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(
        `${(blog.heading || "blog")
          .toString()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase()}--${blog._id}`
      )}`,
      lastModified: safeDate(blog.updatedAt || blog.createdAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const countryEntries = countries
    .map((c) => ({
      name: (c?.country_name || c?.name || "").toString().trim(),
      updatedAt: c?.updatedAt,
      createdAt: c?.createdAt,
    }))
    .filter((c) => c.name)
    .map((c) => ({
      url: `${SITE_URL}/country/${encodeURIComponent(
        c.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      )}`,
      lastModified: safeDate(c.updatedAt || c.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [
    ...staticEntries,
    ...countryCodeEntries,
    ...storeEntries,
    ...dealEntries,
    ...categoryEntries,
    ...blogEntries,
    ...countryEntries,
  ];
}
