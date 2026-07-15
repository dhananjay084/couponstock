import HomeClient from "./HomeClient";
import { buildMetadataAlternates } from "../lib/seoTags";
import { fetchHomePageData } from "../lib/publicPageData";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  return {
    title: "MyCouponstock",
    description: "Coupons & Deals",
    alternates: buildMetadataAlternates("/"),
  };
}

export default async function Page({ params }) {
  const initialData = await fetchHomePageData();

  return <HomeClient {...initialData} />;
}
