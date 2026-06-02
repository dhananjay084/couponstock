import HomePage from "../page";
import { titleize } from "../../lib/slugify";
import { buildCanonicalUrl } from "../../lib/seoTags";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { country } = await params;
  const label = String(country || "").trim().toLowerCase();

  if (!label || label === "in") {
    return {
      title: "My Couponstock",
      description: "Coupons & Deals",
      alternates: {
        canonical: buildCanonicalUrl("/"),
      },
    };
  }

  return {
    title: `${titleize(label)} | My Couponstock`,
    description: `Coupons & deals for ${titleize(label)}.`,
    alternates: {
      canonical: buildCanonicalUrl(`/${label}`),
    },
  };
}

export default function CountryHomePage() {
  return <HomePage />;
}
