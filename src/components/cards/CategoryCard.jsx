"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const CategoryCard = ({ data }) => {
  if (!data) return null;

  const { image, name } = data;
  const categoryHref = name ? `/category/${encodeURIComponent(name.toLowerCase())}` : "#";

  return (
    <CountryLink
      href={categoryHref}
      prefetch
      className="
        flex h-full w-full flex-col cursor-pointer gap-2 text-center text-xs
        transition-all duration-300 hover:-translate-y-1.5
      "
      onClick={(e) => {
        if (!name) {
          e.preventDefault();
          toast.error("Category not found!");
        }
      }}
    >
      <div className="coupon-icon-card flex aspect-square w-full items-center justify-center overflow-hidden">
        <img
          src={image || "/default-category.jpg"}
          className="h-[76%] w-[76%] rounded-[20px] object-cover shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
          alt={name || "Category"}
        />
      </div>
      <p className="line-clamp-3 min-h-[54px] px-2 text-[12px] font-bold leading-5 text-[#31415d]">
        {name || "Unnamed"}
      </p>
    </CountryLink>
  );
};

export default CategoryCard;
