"use client";

import React from "react";
import Image from "next/image";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const FeaturedPost = ({ blog }) => {
  const router = useRouter();
  console.log(blog)
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
    router.push(`/blog/${blog._id}`);
  };

  return (
    <div className="p-4 border-2 border-[#f1f1f1] rounded-lg mx-4">
      <div className="relative w-full h-[300px] mb-4">
        <Image
          src={blog.image || "/default-blog.jpg"}
          alt={blog.title || "Blog Image"}
          fill
          style={{ objectFit: "fill" }}
          className="rounded-lg"
        />
      </div>

      <span className="font-medium text-[15px] flex gap-1 items-center">
        <p>By</p>
        <Typography color="#592ea9">{blog.author || "Author"}</Typography>
      </span>

      <p className="font-medium text-[15px] mt-1">
        {new Date(blog.updatedAt).toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
<p className="font-blod text-xl">{blog.heading}</p>
      <Typography
        sx={{ fontSize: "13px", mt: 1 }}
        dangerouslySetInnerHTML={{ __html: getFirst200Words(blog.details) }}
      />

      <Button
        type="button"
        variant="contained"
        color="black"
        sx={{ color: "#fff", borderRadius: "7px", mt: 2 ,background:'#282828' , cursor: "pointer"}}
        onClick={handleClick}
      >
        View
      </Button>
    </div>
  );
};

export default FeaturedPost;
