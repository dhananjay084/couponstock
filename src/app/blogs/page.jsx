"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/redux/blog/blogSlice";
import BlogCard from "@/components/cards/BlogCard";
import RecentBlogCard from "@/components/cards/NewBlogCard";
import { toast } from "react-toastify";

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blogs || {});
  useEffect(() => {
    dispatch(fetchBlogs()).unwrap().catch(() => toast.error("Failed to load blogs"));
  }, [dispatch]);

  const sorted = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return [...blogs].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [blogs]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[#592EA9]">
        Recent Blog Posts
      </h1>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:grid grid-cols-12 gap-6 mb-14">
        {/* Left large card */}
        <div className="col-span-7">
          {top3[0] && <BlogCard blog={top3[0]} large />}
        </div>

        {/* Right side two small cards */}
        <div className="col-span-5 flex flex-col gap-6">
          {top3[1] && <RecentBlogCard blog={top3[1]} />}
          {top3[2] && <RecentBlogCard blog={top3[2]} />}
        </div>
      </div>

      {/* Rest blogs 2 per row */}
      {rest.length > 0 && (
        <div className="hidden lg:grid grid-cols-2 gap-8 mb-16">
          {rest.map((b) => (
            <RecentBlogCard blog={b} key={b._id} />
          ))}
        </div>
      )}

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden space-y-6">
        {sorted.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
