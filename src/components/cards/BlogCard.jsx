"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Removes ALL HTML tags + trims text
const stripHTML = (html = "") => {
  if (!html) return "";
  const clean = html.replace(/<[^>]+>/g, "");
  return clean.length > 120 ? clean.slice(0, 1020) + "..." : clean;
};

const BlogCard = ({ blog, large }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blog/${blog?._id}`)}
      className={`cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden 
      transition hover:shadow-lg ${large ? "h-full" : ""}`}
    >
      {/* IMAGE */}
      <img
        src={blog.image}
        alt={blog.heading}
        className={`w-full object-cover ${large ? "h-80" : "h-48"}`}
      />

      {/* CONTENT */}
      <div className="p-6">
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 leading-snug">
          {blog.heading}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-[15px] leading-relaxed">
          {stripHTML(blog.details)}
        </p>

        {/* AUTHOR + DATE */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
          <span>By {blog.author || "Admin"}</span>
          <span>
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
