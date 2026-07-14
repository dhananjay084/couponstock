import { buildServerApiUrls } from "./serverApi";
import { fetchJson } from "./serverFetchJson";
const SERVER_FETCH_TIMEOUT_MS = 20000;

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

const fetchFromCandidates = async (path, options = {}) => {
  const urls = buildServerApiUrls(path);

  for (const url of urls) {
    const data = await fetchJson(url, options);
    if (data) return data;
  }

  return null;
};

export const getApiCountryFromRoute = () => "";

export async function fetchHomePageData(countryCode = "") {
  const homepageDealsQuery = buildQueryString({
    showOnHomepage: true,
    limit: 60,
  });
  const homepageStoresQuery = buildQueryString({
    showOnHomepage: true,
    limit: 40,
  });
  const dealCountQuery = buildQueryString({ countOnly: true });
  const storeCountQuery = buildQueryString({ countOnly: true });

  const [deals, stores, categories, reviews, blogs, homeAdminResponse, dealCountResponse, storeCountResponse] = await Promise.all([
    fetchFromCandidates(`/api/deals${homepageDealsQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates(`/api/stores${homepageStoresQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/categories", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/reviews", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/blogs", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/admin", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates(`/api/deals${dealCountQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates(`/api/stores${storeCountQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
  ]);

  return {
    deals: Array.isArray(deals) ? deals : [],
    stores: Array.isArray(stores) ? stores : [],
    categories: Array.isArray(categories) ? categories : [],
    reviews: Array.isArray(reviews) ? reviews : [],
    blogs: Array.isArray(blogs) ? blogs : [],
    homeAdminData: Array.isArray(homeAdminResponse?.data) ? homeAdminResponse.data : [],
    totals: {
      deals: Number(dealCountResponse?.count || 0),
      stores: Number(storeCountResponse?.count || 0),
      categories: Array.isArray(categories) ? categories.length : 0,
    },
  };
}

export async function fetchStoreListingPageData(countryCode = "") {
  const storeListQuery = buildQueryString({
    limit: 80,
  });

  const [stores, homeAdminResponse] = await Promise.all([
    fetchFromCandidates(`/api/stores${storeListQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/admin", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
  ]);

  return {
    stores: Array.isArray(stores) ? stores : [],
    deals: [],
    homeAdminData: Array.isArray(homeAdminResponse?.data) ? homeAdminResponse.data : [],
  };
}

export async function fetchDealListingPageData(countryCode = "") {
  const dealListQuery = buildQueryString({
    limit: 80,
  });
  const storeListQuery = buildQueryString({
    limit: 60,
  });

  const [deals, stores, categories, homeAdminResponse] = await Promise.all([
    fetchFromCandidates(`/api/deals${dealListQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates(`/api/stores${storeListQuery}`, {
      cache: "no-store",
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/categories", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/admin", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
  ]);

  return {
    deals: Array.isArray(deals) ? deals : [],
    stores: Array.isArray(stores) ? stores : [],
    categories: Array.isArray(categories) ? categories : [],
    homeAdminData: Array.isArray(homeAdminResponse?.data) ? homeAdminResponse.data : [],
  };
}

export async function fetchCategoryListingPageData(countryCode = "") {
  const [categories, homeAdminResponse] = await Promise.all([
    fetchFromCandidates("/api/categories", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/admin", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
  ]);

  return {
    categories: Array.isArray(categories) ? categories : [],
    homeAdminData: Array.isArray(homeAdminResponse?.data) ? homeAdminResponse.data : [],
  };
}

export async function fetchBlogsListingPageData() {
  const blogs = await fetchFromCandidates("/api/blogs", {
    next: { revalidate: 300 },
    timeoutMs: SERVER_FETCH_TIMEOUT_MS,
  });

  return {
    blogs: Array.isArray(blogs) ? blogs : [],
  };
}

export async function fetchStoreDetailPageData(slug = "", countryCode = "") {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) {
    return { store: null, initialDeals: [], initialPopularStores: [] };
  }

  const store = await fetchFromCandidates(`/api/stores/slug/${encodeURIComponent(normalizedSlug)}`, {
    next: { revalidate: 300 },
    timeoutMs: SERVER_FETCH_TIMEOUT_MS,
  });

  if (!store) {
    return { store: null, initialDeals: [], initialPopularStores: [] };
  }

  const dealsQuery = buildQueryString({
    store: store.storeName || "",
    limit: 200,
  });

  const [initialDeals, initialPopularStores] = await Promise.all([
    fetchFromCandidates(`/api/deals${dealsQuery}`, {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
    fetchFromCandidates("/api/stores?popularStore=true&limit=12", {
      next: { revalidate: 300 },
      timeoutMs: SERVER_FETCH_TIMEOUT_MS,
    }),
  ]);

  return {
    store,
    initialDeals: Array.isArray(initialDeals) ? initialDeals : [],
    initialPopularStores: Array.isArray(initialPopularStores) ? initialPopularStores : [],
  };
}

export async function fetchDealDetailPageData(slug = "", countryCode = "") {
  const normalizedSlug = String(slug || "").trim();
  if (!normalizedSlug) {
    return { deal: null, initialRelatedDeals: [] };
  }

  const deal = await fetchFromCandidates(`/api/deals/slug/${encodeURIComponent(normalizedSlug)}`, {
    cache: "no-store",
    timeoutMs: SERVER_FETCH_TIMEOUT_MS,
  });

  if (!deal) {
    return { deal: null, initialRelatedDeals: [] };
  }

  const relatedQuery = buildQueryString({
    dealCategory: "deal",
    categorySelect: deal.categorySelect || "",
    limit: 20,
  });

  const initialRelatedDeals = deal.categorySelect
      ? await fetchFromCandidates(`/api/deals${relatedQuery}`, {
        next: { revalidate: 300 },
        timeoutMs: SERVER_FETCH_TIMEOUT_MS,
      })
    : [];

  return {
    deal,
    initialRelatedDeals: Array.isArray(initialRelatedDeals)
      ? initialRelatedDeals.filter((entry) => entry?._id !== deal?._id)
      : [],
  };
}
