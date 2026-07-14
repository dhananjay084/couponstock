import DealListingClient from "./DealListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
import { fetchDealListingPageData } from "../../lib/publicPageData";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    alternates: buildMetadataAlternates("/deal"),
  };
}

export default async function Page({ params }) {
  const initialData = await fetchDealListingPageData();
  return <DealListingClient {...initialData} />;
}
