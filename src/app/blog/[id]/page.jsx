"use client";

import React, { useEffect } from "react";
import Banner from "@/components/Minor/Banner";
import DefaultBanner from "@/assets/banner-image.webp";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, fetchBlogs } from "@/redux/blog/blogSlice";
import BlogCard from "@/components/cards/BlogDetailsCard";
import { useParams } from "next/navigation"; // to get dynamic param

const BlogDetails = () => {
  const params = useParams();
  const id = params?.id; // dynamic route param
  const dispatch = useDispatch();

  const { blogs = [], currentBlog, loading, error } = useSelector(
    (state) => state.blogs || {}
  );

  // Fetch all blogs for the "All Blogs" section
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Fetch the blog by ID when param changes
  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [dispatch, id]);

  const blogDetails = currentBlog?.details || "";
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(blogDetails); // simple HTML check

  return (
    <div className="p-4">
      {/* Banner */}
      <Banner
        Text="Every day we discuss the most interesting things"
        ColorText="discuss"
        BgImage={currentBlog?.image || DefaultBanner}
      />

      <div className="my-4">
        {loading && !currentBlog ? (
          <p className="text-sm text-gray-500">Loading blog...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Error: {error}</p>
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
            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {currentBlog.heading || "Untitled"}
            </h2>
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
        {blogs.map((blog) => (
          <BlogCard key={blog._id} data={blog} border={true} />
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
