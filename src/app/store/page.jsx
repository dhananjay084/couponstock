import StoreListingClient from "./StoreListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { fetchStoreListingPageData } from "../../lib/publicPageData";
import { getConfiguredDefaultCountryCode, getCountryNameFromCode } from "../../lib/countryPath";
import {
  fetchHomeAdminEntries,
  pickDefaultEntry,
  pickEntryByCountryCode,
} from "../../lib/homeAdminSeo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const pathname = country ? `/${country}/store` : "/store";
  const entries = await fetchHomeAdminEntries(country);
  const selected = country
    ? pickEntryByCountryCode(entries, country)
    : pickDefaultEntry(entries);

  return {
    title: selected?.storeMetaTitle?.trim?.() || "Stores | My Couponstock",
    description:
      selected?.storeMetaDescription?.trim?.() ||
      "Browse all stores and brands to find the best offers.",
    alternates: buildMetadataAlternates(pathname),
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  const initialData = await fetchStoreListingPageData(country || defaultCountryCode);
  const initialCountryName = country
    ? getCountryNameFromCode(country) || ""
    : getCountryNameFromCode(defaultCountryCode) || "";

  return <StoreListingClient initialCountry={initialCountryName} {...initialData} />;
}
