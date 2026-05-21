import DealClient from "./DealClient";
import { titleize } from "../../../lib/slugify";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const plainSlug = String(slug || "").split("--")[0];
  const titleBase = titleize(plainSlug || "deal");

  return {
    title: `${titleBase} | My Couponstock`,
    description: "View deal details, coupon information, and active offers.",
  };
}

export default async function Page() {
  return <DealClient deal={null} initialRelatedDeals={[]} />;
}
