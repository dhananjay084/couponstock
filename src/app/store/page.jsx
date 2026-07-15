import StoreListingClient from "./StoreListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  return {
    title: "Stores | My Couponstock",
    description: "Browse all stores and brands to find the best offers.",
    alternates: buildMetadataAlternates("/store"),
  };
}

export default function Page() {
  return <StoreListingClient stores={[]} deals={[]} homeAdminData={[]} />;
}
