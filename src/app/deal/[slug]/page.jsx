import DealClient from "./DealClient";
import { buildServerApiUrls } from "../../../lib/serverApi";
import { fetchJson } from "../../../lib/serverFetchJson";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";

const getDealBySlug = async (slug = "") => {
  const normalizedSlug = String(slug || "").trim();
  if (!normalizedSlug) return null;

  const urls = buildServerApiUrls(`/api/deals/slug/${encodeURIComponent(normalizedSlug)}`);
  for (const url of urls) {
    const data = await fetchJson(url, {
      cache: "no-store",
      timeoutMs: 12000,
    });
    if (data) return data;
  }
  return null;
};

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const plainSlug = String(slug || "").split("--")[0];
  const titleBase = titleize(plainSlug || "deal");
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/deal/${encodeURIComponent(String(slug || ""))}`
    : `/deal/${encodeURIComponent(String(slug || ""))}`;

  return {
    title: `${titleBase} | My Couponstock`,
    description: "View deal details, coupon information, and active offers.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { slug, country } = await params;
  const deal = await getDealBySlug(slug);
  const resolvedSearchParams = await searchParams;

  return (
    <DealClient
      deal={deal}
      initialRelatedDeals={[]}
      initialCategory={String(resolvedSearchParams?.category || "").trim()}
    />
  );
}
