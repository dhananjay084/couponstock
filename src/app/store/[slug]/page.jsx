import StoreClient from "./StoreClient";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const plainSlug = String(slug || "");
  const titleBase = titleize(plainSlug) || "Store";
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/store/${encodeURIComponent(plainSlug)}`
    : `/store/${encodeURIComponent(plainSlug)}`;

  return {
    title: `${titleBase} Coupons & Offers | My Couponstock`,
    description: `Browse ${titleBase} coupons, offers, and related deals.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default function Page() {
  return <StoreClient store={null} initialDeals={[]} initialPopularStores={[]} />;
}
