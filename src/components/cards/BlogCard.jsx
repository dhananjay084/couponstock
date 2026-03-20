"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { slugWithId } from "../../lib/slugify";

// Removes ALL HTML tags + trims text
const stripHTML = (html = "") => {
  if (!html) return "";
  const clean = html.replace(/<[^>]+>/g, "");
  return clean.length > 120 ? clean.slice(0, 1020) + "..." : clean;
};

const trimText = (text = "", limit = 120, suffix = "...") => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + suffix;
};

const BlogCard = ({
  blog,
  large,
  forceFullHeight = false,
  className = "",
  descriptionLimit,
  descriptionSuffix = "...",
  headingClamp,
  descriptionClamp,
  fixedHeight,
}) => {
  const router = useRouter();
  const rawDescription = stripHTML(blog?.details);
  const description =
    typeof descriptionLimit === "number"
      ? trimText(rawDescription, descriptionLimit, descriptionSuffix)
      : rawDescription;

  return (
    <div
      onClick={() => router.push(`/blog/${slugWithId(blog?.heading, blog?._id)}`)}
      className={`cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden 
      transition hover:shadow-lg ${large ? "h-full" : ""} ${forceFullHeight ? "h-full flex flex-col" : ""} ${className}`}
      style={fixedHeight ? { height: fixedHeight } : undefined}
    >
      {/* IMAGE */}
      <img
        src={blog.image}
        alt={blog.heading}
        className={`w-full object-cover ${large ? "h-80" : "h-48"}`}
      />

      {/* CONTENT */}
      <div className={`p-6 ${forceFullHeight ? "flex-1 flex flex-col" : ""}`}>
        {/* TITLE */}
        <h2
          className="text-2xl font-semibold text-gray-800 mb-2 leading-snug"
          style={
            headingClamp
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: headingClamp,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {blog.heading}
        </h2>

        {/* DESCRIPTION */}
        <p
          className="text-gray-500 text-[15px] leading-relaxed"
          style={
            descriptionClamp
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: descriptionClamp,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {description}
        </p>

        {/* AUTHOR + DATE */}
        <div className={`flex justify-between items-center mt-6 text-sm text-gray-400 ${forceFullHeight ? "mt-auto" : ""}`}>
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
