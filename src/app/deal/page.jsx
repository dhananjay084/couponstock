import DealListingClient from "./DealListingClient";
import { buildMetadataAlternates } from "../../lib/seoTags";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = String(resolvedParams?.country || "").trim().toLowerCase();
  const pathname = country ? `/${country}/deal` : "/deal";

  return {
    alternates: buildMetadataAlternates(pathname),
  };
}

export default function Page() {
  return <DealListingClient />;
}
