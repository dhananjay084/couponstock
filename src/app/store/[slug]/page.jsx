import StoreClient from "./StoreClient";
import { titleize } from "../../../lib/slugify";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const titleBase = titleize(String(slug || ""));

  return {
    title: `${titleBase} Coupons & Offers | My Couponstock`,
    description: "Browse store offers, coupon codes, and related deals.",
  };
}

export default async function Page() {
  return (
    <StoreClient
      store={null}
      initialDeals={[]}
      initialPopularStores={[]}
    />
  );
}
