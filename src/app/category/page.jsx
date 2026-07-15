import CategoryListingClient from "./CategoryListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { fetchCategoryListingPageData } from "../../lib/publicPageData";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const { homeAdminData = [] } = await fetchCategoryListingPageData();
  const selected = Array.isArray(homeAdminData) ? homeAdminData[0] : null;

  return {
    title:
      selected?.categoryMetaTitle?.trim?.() || "Categories | My Couponstock",
    description:
      selected?.categoryMetaDescription?.trim?.() ||
      "Browse coupon and deal categories to discover offers faster.",
    alternates: buildMetadataAlternates("/category"),
  };
}

export default async function Page({ params }) {
  const initialData = await fetchCategoryListingPageData();

  return <CategoryListingClient {...initialData} />;
}
