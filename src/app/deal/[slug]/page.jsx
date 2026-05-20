import DealClient from "./DealClient";
import { cache } from "react";
import { buildServerApiUrls } from "../../../lib/serverApi";
import { fetchJson } from "../../../lib/serverFetchJson";

const getDeal = cache(async (slug) => {
  const urls = buildServerApiUrls(`/api/deals/slug/${slug}`);

  const attempts = urls.map((url) =>
    fetchJson(url, { next: { revalidate: 300 } }).then((deal) => {
      if (!deal) {
        throw new Error(`No deal data from ${url}`);
      }
      return deal;
    })
  );

  try {
    return await Promise.any(attempts);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const deal = await getDeal(slug);

  return {
    title: deal?.metaTitle || `${deal?.dealTitle || "Deal"} | My Couponstock`,
    description:
      deal?.metaDescription ||
      deal?.dealDescription?.slice(0, 150),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const deal = await getDeal(slug);

  return <DealClient deal={deal} />;
}
