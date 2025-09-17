"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/redux/blog/blogSlice";
import BlogCard from "@/components/cards/BlogCard";
import RecentBlogCard from "@/components/cards/NewBlogCard"; // keep your component as is
import { toast } from "react-toastify";

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blogs || {});

  useEffect(() => {
    dispatch(fetchBlogs())
      .unwrap()
      .catch(() => toast.error("Failed to load blogs"));
  }, [dispatch]);

  const sorted = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt).getTime();
      return dateB - dateA; // newest first
    });
  }, [blogs]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold mb-8 text-[#592EA9]">Recent Blog Posts</h1>

      {loading && blogs.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Top 3 Blogs: One big + two smaller stacked */}
          <div className="hidden lg:grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-7">
              {top3[0] ? (
                <BlogCard key={top3[0]._id} blog={top3[0]} large />
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            <div className="col-span-5 flex flex-col gap-6">
              {top3[1] ? (
                <RecentBlogCard key={top3[1]._id} blog={top3[1]} />
              ) : (
                <div className="h-44 bg-gray-100 rounded-lg animate-pulse" />
              )}
              {top3[2] ? (
                <RecentBlogCard key={top3[2]._id} blog={top3[2]} />
              ) : (
                <div className="h-44 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
          </div>

          {/* Rest of blogs - 2 per row */}
          {rest.length > 0 && (
            <div className="hidden lg:grid grid-cols-2 gap-8 mb-16">
              {rest.map((blog) => (
                <RecentBlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}

          {/* Mobile / tablet fallback: stacked cards */}
          <div className="lg:hidden space-y-6">
            {sorted.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsPage;
