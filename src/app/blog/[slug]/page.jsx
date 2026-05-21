import BlogDetailsClient from "./BlogDetailsClient";
import { titleize } from "../../../lib/slugify";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const plainSlug = String(slug || "").split("--")[0];

  return {
    title: `${titleize(plainSlug || "blog")} | My Couponstock`,
    description: "Read blog details, stories, and savings updates.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <BlogDetailsClient slug={slug} />;
}
