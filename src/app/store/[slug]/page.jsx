import StoreClient from "./StoreClient";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const titleBase = titleize(String(slug || ""));
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/store/${encodeURIComponent(String(slug || ""))}`
    : `/store/${encodeURIComponent(String(slug || ""))}`;

  return {
    title: `${titleBase} Coupons & Offers | My Couponstock`,
    description: "Browse store offers, coupon codes, and related deals.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default async function Page() {
  return (
    <StoreClient
      store={null}
      initialDeals={[]}
      initialPopularStores={[]}
    />
  );
}
