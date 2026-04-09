"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const CategoryCard = ({ data }) => {
  if (!data) return null;

  const { image, name } = data;
  const categoryHref = name ? `/category/${encodeURIComponent(name.toLowerCase())}` : "#";

  return (
    <Link
      href={categoryHref}
      prefetch
      className="
        w-full cursor-pointer space-y-1 text-center text-xs
        transition-all duration-300 hover:-translate-y-1.5
      "
      onClick={(e) => {
        if (!name) {
          e.preventDefault();
          toast.error("Category not found!");
        }
      }}
    >
      <div className="pro-card flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl p-1.5">
        <img
          src={image || "/default-category.jpg"}
          className="h-full w-full rounded-xl object-cover"
          alt={name || "Category"}
        />
      </div>
      <p className="truncate px-2 text-[11px] font-semibold text-[#39445A]">{name || "Unnamed"}</p>
    </Link>
  );
};

export default CategoryCard;
