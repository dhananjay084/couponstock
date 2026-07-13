import DealListingClient from "./DealListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { getConfiguredDefaultCountryCode, getCountryNameFromCode } from "../../lib/countryPath";
import { fetchDealListingPageData } from "../../lib/publicPageData";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const pathname = country ? `/${country}/deal` : "/deal";

  return {
    alternates: buildMetadataAlternates(pathname),
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  const activeCountryCode = country || defaultCountryCode;
  const fallbackCountryCode = "in";
  const preferredCountryName = country
    ? getCountryNameFromCode(country) || ""
    : getCountryNameFromCode(defaultCountryCode) || "";
  const fallbackCountryName = getCountryNameFromCode(fallbackCountryCode) || "India";
  let initialData = await fetchDealListingPageData(activeCountryCode);
  let initialCountry = preferredCountryName;

  const hasOfferData =
    Array.isArray(initialData?.deals) && initialData.deals.length > 0;
  if (!hasOfferData && activeCountryCode && activeCountryCode !== fallbackCountryCode) {
    const fallbackData = await fetchDealListingPageData(fallbackCountryCode);
    if (Array.isArray(fallbackData?.deals) && fallbackData.deals.length > 0) {
      initialData = fallbackData;
      initialCountry = fallbackCountryName;
    }
  }

  return <DealListingClient initialCountry={initialCountry} {...initialData} />;
}
