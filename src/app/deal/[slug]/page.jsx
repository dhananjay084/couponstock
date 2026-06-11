import DealClient from "./DealClient";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";
import { fetchDealDetailPageData } from "../../../lib/publicPageData";

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
  const initialData = await fetchDealDetailPageData(slug, country);
  const resolvedSearchParams = await searchParams;

  return (
    <DealClient
      {...initialData}
      initialCategory={String(resolvedSearchParams?.category || "").trim()}
    />
  );
}
