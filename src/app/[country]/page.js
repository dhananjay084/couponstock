import HomePage, { generateMetadata as generateHomeMetadata } from "../page";
import { titleize } from "../../lib/slugify";
import { buildCanonicalUrl } from "../../lib/seoTags";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { country } = await params;
  const label = String(country || "").trim().toLowerCase();

  if (!label || label === "in" || label === "gl") {
    return {
      title: label === "gl" ? "Gl | MyCouponstock" : "MyCouponstock",
      description: "Coupons & Deals",
      alternates: {
        canonical: buildCanonicalUrl(label === "gl" ? "/gl" : "/"),
      },
    };
  }

  const metadata = await generateHomeMetadata({ params: Promise.resolve({ country: label }) });
  return {
    ...metadata,
    title: metadata?.title || `${titleize(label)} | My Couponstock`,
    description: metadata?.description || `Coupons & deals for ${titleize(label)}.`,
    alternates: {
      ...(metadata?.alternates || {}),
      canonical: buildCanonicalUrl(`/${label}`),
    },
  };
}

export default function CountryHomePage({ params }) {
  return <HomePage params={params} />;
}
