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
  showViewButton = false,
  compact = false,
}) => {
  const router = useRouter();
  const detailUrl = `/blog/${slugWithId(blog?.heading, blog?._id)}`;
  const rawDescription = stripHTML(blog?.details);
  const description =
    typeof descriptionLimit === "number"
      ? trimText(rawDescription, descriptionLimit, descriptionSuffix)
      : rawDescription;
  const headingClampValue = typeof headingClamp === "number" ? headingClamp : undefined;
  const headingStyle =
    headingClampValue === 1
      ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
      : headingClampValue
        ? {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: headingClampValue,
            overflow: "hidden",
          }
        : undefined;

  return (
    <div
      onClick={() => router.push(detailUrl)}
      className={`pro-card cursor-pointer overflow-hidden 
      transition hover:shadow-lg ${large ? "h-full" : ""} ${forceFullHeight ? "h-full flex flex-col" : ""} ${className}`}
      style={fixedHeight ? { height: fixedHeight } : undefined}
    >
      {/* IMAGE */}
      <img
        src={blog.image}
        alt={blog.heading}
        className={`w-full object-cover ${large ? "h-80" : compact ? "h-36" : "h-48"}`}
      />

      {/* CONTENT */}
      <div className={`${compact ? "p-4 sm:p-5" : "p-6"} ${forceFullHeight ? "flex-1 flex flex-col" : ""}`}>
        {/* TITLE */}
        <h2
          className={`${compact ? "mb-2 text-lg" : "mb-2 text-xl"} font-bold leading-snug text-[#1A243B]`}
          style={headingStyle}
        >
          {blog.heading}
        </h2>

        {/* DESCRIPTION */}
        <p
          className="text-[14px] leading-relaxed text-[#5D6780]"
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

        {/* AUTHOR + DATE + ACTION */}
        <div
          className={`mt-4 flex items-end justify-between gap-3 text-sm text-[#7B8498] ${
            forceFullHeight ? "mt-auto" : ""
          }`}
        >
          <div className="min-w-0">
            <p className="truncate">By {blog.author || "Admin"}</p>
            <p>
              {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {showViewButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(detailUrl);
              }}
              className="shrink-0 rounded-lg bg-[#5B3CC4] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4A2FA8]"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
