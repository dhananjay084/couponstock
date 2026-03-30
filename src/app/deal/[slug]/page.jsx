import DealClient from "./DealClient";
import { fetchJson } from "../../../lib/serverFetchJson";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const deal = await fetchJson(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${slug}`,
    { next: { revalidate: 300 } }
  );

  return {
    title: deal?.metaTitle || `${deal?.dealTitle || "Deal"} | My Couponstock`,
    description:
      deal?.metaDescription ||
      deal?.dealDescription?.slice(0, 150),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const deal = await fetchJson(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${slug}`,
    { next: { revalidate: 300 } }
  );

  return <DealClient deal={deal} />;
}
