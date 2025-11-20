"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Remove HTML + trim description (dynamic length)
const stripHTML = (html = "", limit = 90) => {
  if (!html) return "";
  const clean = html.replace(/<[^>]+>/g, "");
  return clean.length > limit ? clean.slice(0, limit) + "..." : clean;
};

const RecentBlogCard = ({ blog, large = false }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blog/${blog?._id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden
      transition hover:shadow-lg flex flex-col"
    >
      <img
        src={blog.image}
        alt={blog.heading}
        className={`w-full object-cover ${large ? "h-60" : "h-44"}`}
      />

      <div className="p-5">
        <h3
          className={`font-semibold text-gray-800 leading-snug mb-2 ${
            large ? "text-2xl" : "text-xl"
          }`}
        >
          {blog.heading}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-[15px] leading-relaxed">
          {stripHTML(blog.details, large ? 180 : 90)}
        </p>

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

export default RecentBlogCard;
