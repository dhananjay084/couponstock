import BlogDetailsClient from "./BlogDetailsClient";
import { titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const plainSlug = String(slug || "").split("--")[0];
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/blog/${encodeURIComponent(String(slug || ""))}`
    : `/blog/${encodeURIComponent(String(slug || ""))}`;

  return {
    title: `${titleize(plainSlug || "blog")} | My Couponstock`,
    description: "Read blog details, stories, and savings updates.",
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <BlogDetailsClient slug={slug} />;
}
