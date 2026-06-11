import StoreClient from "./StoreClient";
import { cache } from "react";
import { buildServerApiUrls } from "../../../lib/serverApi";
import { fetchJson } from "../../../lib/serverFetchJson";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";
import { fetchStoreDetailPageData } from "../../../lib/publicPageData";

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
  const initialData = await fetchStoreDetailPageData(slug, country);

  return <StoreClient {...initialData} />;
}
