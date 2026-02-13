import DealClient from "./DealClient";

export async function generateMetadata({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${params.slug}`,
    { cache: "no-store" }
  );

  const deal = await res.json();

  return {
    title: deal.metaTitle || `${deal.dealTitle} | My Couponstock`,
    description:
      deal.metaDescription ||
      deal.dealDescription?.slice(0, 150),
  };
}

export default async function Page({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${params.slug}`,
    { cache: "no-store" }
  );

  const deal = await res.json();

  return <DealClient deal={deal} />;
}