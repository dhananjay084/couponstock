"use client";

import React from "react";
import Image from "next/image";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { slugWithId } from "../../lib/slugify";

const FeaturedPost = ({ blog }) => {
  const router = useRouter();
  const getFirst200Words = (htmlString) => {
    // Strip HTML and get plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    // Get first 200 words (or first 100 for brevity as original)
    const truncated = plainText.split(" ").slice(0, 100).join(" ") + "...";

    // Sanitize it
    return DOMPurify.sanitize(truncated);
  };

  const handleClick = () => {
    if (!blog?._id) {
          toast.error("blog ID is missing!");
          return;
        }
    router.push(`/blog/${slugWithId(blog?.heading, blog?._id)}`);
  };

  return (
    <div className="pro-card w-full p-4">
      <div className="relative w-full h-[300px] mb-4">
        <Image
          src={blog.image || "/default-blog.jpg"}
          alt={blog.title || "Blog Image"}
          fill
          style={{ objectFit: "fill" }}
          className="rounded-lg"
        />
      </div>

      <span className="flex items-center gap-1 text-[14px] font-medium text-[#59637A]">
        <p>By</p>
        <Typography color="#5b3cc4" fontWeight={700}>{blog.author || "Author"}</Typography>
      </span>

      <p className="mt-1 text-[13px] font-medium text-[#6F7890]">
        {new Date(blog.updatedAt).toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="line-clamp-2 text-xl font-bold text-[#1A243B]">{blog.heading}</p>
      <Typography
        sx={{ fontSize: "13px", mt: 1, color: "#59637A", lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: getFirst200Words(blog.details) }}
      />

      <Button
        type="button"
        variant="contained"
        color="black"
        sx={{ color: "#fff", borderRadius: "10px", mt: 2 ,background:'#5B3CC4' , cursor: "pointer", fontWeight: 700, px: 2.2 }}
        onClick={handleClick}
      >
        Read Post
      </Button>
    </div>
  );
};

export default FeaturedPost;
