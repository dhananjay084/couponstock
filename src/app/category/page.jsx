import CategoryListingClient from "./CategoryListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { fetchCategoryListingPageData } from "../../lib/publicPageData";
import {
  fetchHomeAdminEntries,
  pickDefaultEntry,
  pickEntryByCountryCode,
} from "../../lib/homeAdminSeo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const pathname = country ? `/${country}/category` : "/category";
  const entries = await fetchHomeAdminEntries(country);
  const selected = country
    ? pickEntryByCountryCode(entries, country)
    : pickDefaultEntry(entries);

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
  const initialData = await fetchCategoryListingPageData(country);

  return <CategoryListingClient {...initialData} />;
}
