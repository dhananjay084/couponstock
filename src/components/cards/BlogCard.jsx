// components/cards/BlogCard.jsx
"use client"; // Required for client-side hooks like useRouter

import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BlogCard = ({ blog }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!blog?._id) {
    toast.error("Blog not found!");
    return;
  }
    router.push(`/blog/${blog._id}`); // Next.js client-side navigation
    //  toast.success("Opening blog...");
  };

  return (
    <div
      className=" lg:min-w-[500px] min-w-[300px] bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={blog.image}
        alt={blog.heading}
        className="w-full h-40 object-fill md:h-60 lg:h-85"
      />

      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-purple-600">
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <button
            className="text-[#592EA9] transition-transform duration-300 cursor-pointer"
            aria-label="Toggle expand"
          >
            <FaChevronDown className="transform transition-transform duration-300" />
          </button>
        </div>

        <h2 className="text-lg font-bold mt-2">{blog.heading}</h2>

        <Typography
          sx={{ fontSize: "13px" }}
          dangerouslySetInnerHTML={{ __html: blog.details.substring(0, 300) }}
        />

        <div className="flex gap-2 mt-2 flex-wrap">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-purple-100 text-[#592EA9] rounded-full px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
