"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const PopularStores = ({ data }) => {
  if (!data) return null;

  const { discountPercentage, storeImage, slug, storeName } = data;
  const storeHref = slug ? `/store/${slug}` : "#";

  return (
    <div className="pro-card relative w-[200px] flex-shrink-0 overflow-hidden md:w-[220px] lg:w-[250px]">
      <img
        src={storeImage || "/default-store.jpg"}
        className="h-[130px] w-full object-cover md:h-[146px] lg:h-[164px]"
        alt="Store"
      />

      {typeof discountPercentage === "number" && (
        <div className="absolute left-2 top-2 z-10 rounded-full border border-[#CFF6E5] bg-[#EAFBF4] px-2.5 py-1 text-[10px] font-semibold text-[#0f9f62]">
          {discountPercentage}% OFF
        </div>
      )}

      <div className="absolute bottom-3 z-10 w-full items-center px-2">
        <Link
          href={storeHref}
          prefetch
          className="pro-btn-soft float-right text-xs"
          onClick={(e) => {
            if (!slug) {
              e.preventDefault();
              toast.error("Store slug not found!");
            }
          }}
        >
          View
        </Link>
      </div>
      <div className="border-t border-[#ECE2FF] px-3 py-2">
        <p className="truncate text-sm font-semibold text-[#33265a]">{storeName || "Store"}</p>
      </div>
    </div>
  );
};

export default PopularStores;
