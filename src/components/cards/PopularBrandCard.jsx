"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const PopularBrandCard = ({ data }) => {
  if (!data) {
    toast.error("Brand data not found!");
    return null;
  }

  const { storeImage, storeName, slug } = data;
  const storeHref = slug ? `/store/${slug}` : "#";

  return (
    <div className="w-[200px] flex-shrink-0 md:w-[220px] lg:w-[250px]">
      <div className="pro-card relative overflow-hidden">
        <img
          src={storeImage || "/default-store.jpg"}
          className="h-[130px] w-full object-cover md:h-[146px] lg:h-[164px]"
          alt={storeName || "Brand"}
        />
        <div className="absolute bottom-3 right-3 z-10">
          <Link
            href={storeHref}
            prefetch
            className="pro-btn-soft"
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
      </div>
      <div className="my-2">
        <p className="truncate text-sm font-semibold text-[#33265a]">{storeName}</p>
      </div>
    </div>
  );
};

export default PopularBrandCard;
