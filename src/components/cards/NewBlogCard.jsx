"use client";

import React from "react";
import Link from "next/link";
import { slugWithId } from "../../lib/slugify";
import { htmlToPlainText } from "../../lib/plainText";

const RecentBlogCard = ({ blog, large = false }) => {
  const detailUrl = `/blog/${slugWithId(blog?.heading, blog?._id)}`;

  return (
    <Link
      href={detailUrl}
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
          {htmlToPlainText(blog.details).slice(0, large ? 180 : 90)}
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
    </Link>
  );
};

export default RecentBlogCard;
