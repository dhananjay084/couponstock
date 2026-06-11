import HomeClient from "./HomeClient";
import { buildMetadataAlternates } from "../lib/seoTags";
import {
  fetchHomeAdminEntries,
  pickDefaultEntry,
  pickEntryByCountryCode,
} from "../lib/homeAdminSeo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const entries = await fetchHomeAdminEntries(country);
  const selected = country
    ? pickEntryByCountryCode(entries, country)
    : pickDefaultEntry(entries);

  return {
    title: selected?.homeMetaTitle?.trim?.() || "MyCouponstock",
    description: selected?.homeMetaDescription?.trim?.() || "Coupons & Deals",
    alternates: buildMetadataAlternates("/"),
  };
}

export default function Page() {
  return <HomeClient />;
}
