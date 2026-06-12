import HomeClient from "./HomeClient";
import { buildMetadataAlternates } from "../lib/seoTags";
import {
  fetchHomeAdminEntries,
  pickDefaultEntry,
  pickEntryByCountryCode,
} from "../lib/homeAdminSeo";
import { fetchHomePageData } from "../lib/publicPageData";

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

export default async function Page({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const initialData = await fetchHomePageData(country);

  return <HomeClient {...initialData} />;
}
