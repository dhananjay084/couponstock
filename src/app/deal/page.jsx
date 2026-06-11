import DealListingClient from "./DealListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";
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
  const initialData = await fetchDealListingPageData(country);

  return <DealListingClient {...initialData} />;
}
