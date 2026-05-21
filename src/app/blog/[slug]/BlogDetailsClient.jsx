"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner from "../../../components/Minor/Banner";
import DefaultBanner from "../../../assets/banner-image.webp";
import { Typography } from "@mui/material";
import BlogCard from "../../../components/cards/BlogDetailsCard";
import { extractIdFromSlug, titleize } from "../../../lib/slugify";
import ArrowScrollRow from "../../../components/Minor/ArrowScrollRow";
import { buildPublicApiUrl } from "../../../lib/publicApiBase";

const BlogDetailsClient = ({
  currentBlog: initialCurrentBlog = null,
  otherBlogs: initialOtherBlogs = [],
  slug = "",
}) => {
  const [currentBlog, setCurrentBlog] = useState(initialCurrentBlog);
  const [otherBlogs, setOtherBlogs] = useState(initialOtherBlogs);
  const [loading, setLoading] = useState(!initialCurrentBlog);

  useEffect(() => {
    const blogId = extractIdFromSlug(slug || "");
    if (!blogId) {
      setLoading(false);
      return;
    }

    if (initialCurrentBlog?._id === blogId) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadBlogData = async () => {
      try {
        setLoading(true);
        const [blogRes, blogsRes] = await Promise.all([
          axios.get(buildPublicApiUrl(`/api/blogs/${blogId}`)),
          axios.get(buildPublicApiUrl("/api/blogs"), {
            params: { excludeId: blogId, limit: 10 },
          }),
        ]);

        if (!active) return;

        setCurrentBlog(blogRes.data || null);
        setOtherBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
      } catch (error) {
        if (!active) return;
        setCurrentBlog(null);
        setOtherBlogs([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlogData();

    return () => {
      active = false;
    };
  }, [slug, initialCurrentBlog]);

  const blogDetails = currentBlog?.details || "";
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(blogDetails);
  const headingText =
    currentBlog?.heading || (slug ? titleize(String(slug).split("--")[0]) : "Blog");
  const hasOtherBlogs = otherBlogs.length > 0;
  const publishDate = currentBlog
    ? new Date(
        currentBlog.createdAt || currentBlog.updatedAt || Date.now()
      ).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="p-4">
      {currentBlog && (
        <section className="mx-2 mt-2 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {headingText || "Untitled"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Read this detailed post and explore more stories from our blog.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
              {publishDate}
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
              {otherBlogs.length} More Blogs
            </span>
          </div>
        </section>
      )}

      <Banner
        Text="Every day we discuss the most interesting things"
        ColorText="discuss"
        BgImage={currentBlog?.image || DefaultBanner.src}
        link=""
      />

      <div className="my-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading blog...</p>
        ) : currentBlog ? (
          <>
            <p className="text-sm text-purple-600 font-semibold">{publishDate}</p>
            <Typography
              sx={{ fontSize: "13px" }}
              {...(isHTML
                ? { dangerouslySetInnerHTML: { __html: blogDetails } }
                : { children: blogDetails })}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">No blog found.</p>
        )}
      </div>

      {hasOtherBlogs && (
        <>
          <h2 className="my-8 text-2xl font-semibold">All Blogs</h2>
          <ArrowScrollRow
            controlsClassName="px-1"
            scrollerClassName="flex gap-4 overflow-x-auto"
          >
            {otherBlogs.map((blog) => (
              <BlogCard key={blog._id} data={blog} border={true} />
            ))}
          </ArrowScrollRow>
        </>
      )}
    </div>
  );
};

export default BlogDetailsClient;
