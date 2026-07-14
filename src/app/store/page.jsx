import StoreListingClient from "./StoreListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { fetchStoreListingPageData } from "../../lib/publicPageData";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: "Stores | My Couponstock",
    description: "Browse all stores and brands to find the best offers.",
    alternates: buildMetadataAlternates("/store"),
  };
}

export default async function Page({ params }) {
  const initialData = await fetchStoreListingPageData();
  return <StoreListingClient {...initialData} />;
}
