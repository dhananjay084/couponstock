import DealClient from "./DealClient";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";

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

export default async function Page() {
  return <DealClient deal={null} initialRelatedDeals={[]} />;
}
