// app/blogs/page.jsx
"use client"; // Required because we use useEffect and Redux hooks

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/redux/blog/blogSlice";
import BlogCard from "@/components/cards/BlogCard";
import RecentBlogCrad from "@/components/cards/NewBlogCard";

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blogs || {});

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Memoized sorting of blogs
  const sorted = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return [...blogs].sort((a, b) => {
      const dateA = new Date(b.createdAt || b.updatedAt).getTime();
      const dateB = new Date(a.createdAt || a.updatedAt).getTime();
      return dateA - dateB;
    });
  }, [blogs]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recent Blog Posts</h1>

      {loading && blogs.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Top 3 blogs layout */}
          <div className="gap-4 items-center mb-6 hidden lg:flex">
            <div className="w-1/2">
              {top3[0] ? (
                <BlogCard key={top3[0]._id} blog={top3[0]} />
              ) : (
                <div className="h-40 bg-gray-100 rounded">No blog</div>
              )}
            </div>
            <div className="w-1/2 space-y-2">
              {top3[1] ? (
                <RecentBlogCrad key={top3[1]._id} blog={top3[1]} />
              ) : (
                <div className="h-20 bg-gray-100 rounded">No blog</div>
              )}
              {top3[2] ? (
                <RecentBlogCrad key={top3[2]._id} blog={top3[2]} />
              ) : (
                <div className="h-20 bg-gray-100 rounded">No blog</div>
              )}
            </div>
          </div>

          {/* Rest blogs */}
          {rest.length > 0 && (
            <div className="space-y-4 mb-6 hidden lg:block">
              {rest.map((blog) => (
                <RecentBlogCrad key={blog._id} blog={blog} />
              ))}
            </div>
          )}

          {/* Fallback view for small screens */}
          <div className="gap-4 overflow-x-auto lg:hidden">
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
