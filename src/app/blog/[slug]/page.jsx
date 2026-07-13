import BlogDetailsClient from "./BlogDetailsClient";
import { extractIdFromSlug, titleize } from "../../../lib/slugify";
import { buildCanonicalUrl } from "../../../lib/seoTags";
import { buildServerApiUrls } from "../../../lib/serverApi";
import { fetchJson } from "../../../lib/serverFetchJson";

export const dynamic = "force-dynamic";

const stripHtml = (value = "") =>
  String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const trimText = (value = "", limit = 160) => {
  const text = stripHtml(value);
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
};

const fetchFromCandidates = async (urls, options = {}) => {
  for (const url of urls) {
    const data = await fetchJson(url, options);
    if (data) return data;
  }
  return null;
};

async function getBlogPageData(slug = "") {
  const blogId = extractIdFromSlug(slug);
  if (!blogId) {
    return { currentBlog: null, otherBlogs: [] };
  }

  const currentBlog = await fetchFromCandidates(buildServerApiUrls(`/api/blogs/${blogId}`), {
    cache: "no-store",
    timeoutMs: 12000,
  });

  const otherBlogs = await fetchFromCandidates(
    buildServerApiUrls(`/api/blogs?excludeId=${encodeURIComponent(blogId)}&limit=10`),
    {
      next: { revalidate: 300 },
      timeoutMs: 12000,
    }
  );

  return {
    currentBlog: currentBlog || null,
    otherBlogs: Array.isArray(otherBlogs) ? otherBlogs : [],
  };
}

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const plainSlug = String(slug || "").split("--")[0];
  const { currentBlog } = await getBlogPageData(slug);
  const canonicalPath = country
    ? `/${String(country).trim().toLowerCase()}/blog/${encodeURIComponent(String(slug || ""))}`
    : `/blog/${encodeURIComponent(String(slug || ""))}`;
  const title = currentBlog?.heading?.trim() || titleize(plainSlug || "blog");
  const description =
    trimText(currentBlog?.details || "", 165) ||
    "Read blog details, stories, and savings updates.";

  return {
    title: `${title} | My Couponstock`,
    description,
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { currentBlog, otherBlogs } = await getBlogPageData(slug);

  return (
    <BlogDetailsClient
      slug={slug}
      currentBlog={currentBlog}
      otherBlogs={otherBlogs}
    />
  );
}
