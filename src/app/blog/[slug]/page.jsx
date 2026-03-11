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
 return (
  <div className="p-4">
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
            {new Date(
              currentBlog.createdAt || currentBlog.updatedAt || Date.now()
            ).toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mt-2">
            {headingText || "Untitled"}
          </h1>
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
    <h2 className="font-semibold text-2xl my-8">All Blogs</h2>
    <div className="gap-4 overflow-x-auto flex">
      {loading && blogs.length === 0 ? (
        <RowSkeleton count={3} />
      ) : blogs.map((blog) => (
        <BlogCard key={blog._id} data={blog} border={true} />
      ))}
    </div>
  </div>
);

};

export default BlogDetails;
