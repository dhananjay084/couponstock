// components/cards/Card.jsx
"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const Card = ({ blog }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${blog._id}`); // Next.js navigation
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden max-h-64">
        {/* Left Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={blog.image}
            alt={blog.heading}
            className="w-full h-full object-fill"
          />
        </div>

        {/* Right Content */}
        <div className="p-6 md:w-1/2 w-full flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-sm text-purple-600 font-semibold">
              {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {`${blog.heading.substring(0, 20)}...`}
            </h2>

            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              <Typography
                sx={{ fontSize: "13px" }}
                dangerouslySetInnerHTML={{ __html: blog.details.substring(0, 100) }}
              />
            </p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-purple-100 text-purple-600 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
