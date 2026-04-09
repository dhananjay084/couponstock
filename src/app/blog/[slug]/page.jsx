"use client";

import React, { useEffect } from "react";
import Banner from "../../../components/Minor/Banner";
import DefaultBanner from "../../../assets/banner-image.webp";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, fetchBlogs } from "../../../redux/blog/blogSlice";
import BlogCard from "../../../components/cards/BlogDetailsCard";
import { useParams } from "next/navigation"; // to get dynamic param
import { extractIdFromSlug, titleize } from "../../../lib/slugify";
import { RowSkeleton, TextSkeleton } from "../../../components/skeletons/InlineSkeletons";
import { toast } from "react-toastify";

const BlogDetails = () => {
  const params = useParams();
  const slug = params?.slug;
  const id = extractIdFromSlug(slug || "");
  const dispatch = useDispatch();

  const { blogs = [], currentBlog, loading, error } = useSelector(
    (state) => state.blogs || {}
  );

  // Fetch all blogs for the "All Blogs" section
  useEffect(() => {
    dispatch(fetchBlogs())
      .unwrap()
      // .catch(() => toast.error("Failed to load blogs"));
  }, [dispatch]);

  // Fetch the blog by ID when param changes
  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id))
        .unwrap()
        // .then(() => toast.success("Blog loaded successfully!"))
        .catch(() => toast.error("Failed to load blog"));
    }
  }, [dispatch, id]);

  const blogDetails = currentBlog?.details || "";
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(blogDetails); // simple HTML check
  const headingText = currentBlog?.heading || (slug ? titleize(slug.split("--")[0]) : "Blog");
  const otherBlogs = blogs.filter((blog) => blog?._id !== currentBlog?._id);
  const hasOtherBlogs = otherBlogs.length > 0;
  const publishDate = currentBlog
    ? new Date(currentBlog.createdAt || currentBlog.updatedAt || Date.now()).toLocaleDateString(undefined, {
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

    {/* Banner */}
    {currentBlog?.image ? (
      <Banner
        Text="Every day we discuss the most interesting things"
        ColorText="discuss"
        BgImage={currentBlog.image}
        link=''
      />
    ) : (
      <Banner
        Text="Every day we discuss the most interesting things"
        ColorText="discuss"
        BgImage={DefaultBanner.src} // fallback until image is loaded
        link=''
      />
    )}

    <div className="my-4">
      {loading && !currentBlog ? (
        <div className="space-y-4">
          <TextSkeleton className="h-5 w-48" />
          <TextSkeleton className="h-8 w-2/3" />
          <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      ) : error ? (
        <>
          <p className="text-sm text-red-600">Error: {error}</p>
        </>
      ) : currentBlog ? (
        <>
          <p className="text-sm text-purple-600 font-semibold">
            {publishDate}
          </p>
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

    {/* All Blogs Section */}
    {(loading || hasOtherBlogs) && (
      <>
        <h2 className="font-semibold text-2xl my-8">All Blogs</h2>
        <div className="gap-4 overflow-x-auto flex">
          {loading && blogs.length === 0 ? (
            <RowSkeleton count={3} />
          ) : (
            otherBlogs.map((blog) => (
              <BlogCard key={blog._id} data={blog} border={true} />
            ))
          )}
        </div>
      </>
    )}
  </div>
);

};

export default BlogDetails;
