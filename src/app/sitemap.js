import { fetchJson } from "../lib/serverFetchJson";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
const API_BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/$/, "");

export const revalidate = 3600; // 1 hour

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/blogs",
  "/store",
  "/category",
  "/deal",
  "/privacy",
  "/terms",
];

async function getJson(path) {
  if (!API_BASE_URL) return [];
  try {
    const data = await fetchJson(`${API_BASE_URL}${path}`, { cache: "no-store" });
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
  const [stores, deals, categories, blogs] = await Promise.all([
    getJson("/api/stores"),
    getJson("/api/deals"),
    getJson("/api/categories"),
    getJson("/api/blogs"),
  ]);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const storeEntries = stores
    .filter((store) => store?.slug)
    .map((store) => ({
      url: `${SITE_URL}/store/${encodeURIComponent(store.slug)}`,
      lastModified: safeDate(store.updatedAt || store.createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const dealEntries = deals
    .map((deal) => deal?.slug || deal?._id)
    .filter(Boolean)
    .map((slugOrId) => ({
      url: `${SITE_URL}/deal/${encodeURIComponent(slugOrId)}`,
      lastModified: new Date(),
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

  return [
    ...staticEntries,
    ...storeEntries,
    ...dealEntries,
    ...categoryEntries,
    ...blogEntries,
  ];
}
