"use client";

import React from "react";
import Image from "next/image";
import { Typography, Button } from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";
import { slugWithId } from "../../lib/slugify";
import { htmlToPlainText } from "../../lib/plainText";

const FeaturedPost = ({ blog }) => {
  const detailUrl = `/blog/${slugWithId(blog?.heading, blog?._id)}`;
  const getFirst200Words = (htmlString) => {
    const plainText = htmlToPlainText(htmlString);
    return plainText.split(" ").slice(0, 100).join(" ") + "...";
  };

  const handleClick = () => {
    if (!blog?._id) {
          toast.error("blog ID is missing!");
          return;
        }
  };

  return (
    <Link href={detailUrl} className="pro-card block w-full p-4">
      <div className="relative w-full h-[300px] mb-4">
        <Image
          src={blog.image || "/default-blog.jpg"}
          alt={blog.title || "Blog Image"}
          fill
          style={{ objectFit: "fill" }}
          className="rounded-lg"
        />
      </div>

      <div className="flex items-center gap-1 text-[14px] font-medium text-[#59637A]">
        <span>By</span>
        <Typography component="span" color="#5b3cc4" fontWeight={700}>
          {blog.author || "Author"}
        </Typography>
      </div>

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
      >
        {getFirst200Words(blog.details)}
      />

      <Button
        type="button"
        variant="contained"
        color="black"
        sx={{ color: "#fff", borderRadius: "10px", mt: 2 ,background:'#5B3CC4' , cursor: "pointer", fontWeight: 700, px: 2.2 }}
        onClick={(e) => {
          if (!blog?._id) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        Read Post
      </Button>
    </Link>
  );
};

export default FeaturedPost;
