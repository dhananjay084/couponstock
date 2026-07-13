import StoreClient from "./StoreClient";
import { cache } from "react";
import { buildServerApiUrls } from "../../../lib/serverApi";
import { fetchJson } from "../../../lib/serverFetchJson";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";
import { getApiCountryFromRoute } from "../../../lib/publicPageData";

export const dynamic = "force-dynamic";

const getStoreBySlug = cache(async (slug) => {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;

  const urls = buildServerApiUrls(`/api/stores/slug/${encodeURIComponent(normalizedSlug)}`);
  const attempts = urls.map((url) =>
    fetchJson(url, { next: { revalidate: 300 } }).then((store) => {
      if (!store) {
        throw new Error(`No store data from ${url}`);
      }
      return store;
    })
  );

  try {
    return await Promise.any(attempts);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const plainSlug = String(slug || "");
  const titleBase = titleize(plainSlug);
  const store = await getStoreBySlug(plainSlug);
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/store/${encodeURIComponent(plainSlug)}`
    : `/store/${encodeURIComponent(plainSlug)}`;

  return {
    title: String(store?.metaTitle || "").trim() || `${titleBase} Coupons & Offers | My Couponstock`,
    description:
      String(store?.metaDescription || "").trim() ||
      "Browse store offers, coupon codes, and related deals.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default async function Page({ params }) {
  const { slug, country } = await params;
  const store = await getStoreBySlug(String(slug || ""));
  const storeName = String(store?.storeName || "").trim();
  const countryName = getApiCountryFromRoute(String(country || "").trim().toLowerCase());
  const query = new URLSearchParams();

  if (countryName) {
    query.set("country", countryName);
  }

  if (storeName) {
    query.set("store", storeName);
    query.set("limit", "120");
  }

  let initialDeals = [];
  if (storeName) {
    const dealUrls = buildServerApiUrls(`/api/deals?${query.toString()}`);
    for (const url of dealUrls) {
      const data = await fetchJson(url, {
        cache: "no-store",
        timeoutMs: 12000,
      });
      if (Array.isArray(data)) {
        initialDeals = data;
        break;
      }
    }
  }

  return (
    <StoreClient
      store={store}
      initialDeals={initialDeals}
      initialPopularStores={[]}
    />
  );
}
