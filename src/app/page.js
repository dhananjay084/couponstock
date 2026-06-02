import HomeClient from "./HomeClient";
import { buildMetadataAlternates } from "../lib/seoTags";

export async function generateMetadata() {
  return {
    alternates: buildMetadataAlternates("/"),
  };
}

export default function Page() {
  return <HomeClient />;
}
