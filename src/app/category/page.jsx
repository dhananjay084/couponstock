import CategoryListingClient from "./CategoryListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { getConfiguredDefaultCountryCode, getCountryNameFromCode } from "../../lib/countryPath";
import { fetchCategoryListingPageData } from "../../lib/publicPageData";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const pathname = country ? `/${country}/category` : "/category";
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  const activeCountryCode = country || defaultCountryCode;
  const { homeAdminData = [] } = await fetchCategoryListingPageData(activeCountryCode);
  const selected = Array.isArray(homeAdminData) ? homeAdminData[0] : null;

  return {
    title:
      selected?.categoryMetaTitle?.trim?.() || "Categories | My Couponstock",
    description:
      selected?.categoryMetaDescription?.trim?.() ||
      "Browse coupon and deal categories to discover offers faster.",
    alternates: buildMetadataAlternates(pathname),
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  const activeCountryCode = country || defaultCountryCode;
  const initialCountry = country
    ? getCountryNameFromCode(country) || ""
    : getCountryNameFromCode(defaultCountryCode) || "";
  const initialData = await fetchCategoryListingPageData(activeCountryCode);

  return <CategoryListingClient initialCountry={initialCountry} {...initialData} />;
}
