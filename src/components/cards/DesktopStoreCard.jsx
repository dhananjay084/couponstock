"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";


const BannerCard = ({ data }) => {
  // if (!data) return null;
   if (!data) {
    toast.error("Store data not available!");
    return null;
  }

  const storeHref = data?.slug ? `/store/${data.slug}` : "#";

  return (
    <div className="pro-card w-full min-w-[322px] max-w-sm overflow-hidden">
      <img
        src={data.storeImage}
        alt="Promotion"
        className="h-[220px] w-full object-cover"
      />

      <div className="flex items-center justify-between gap-3 p-3">
        <span className="max-w-[62%]">
          <p className="line-clamp-2 text-sm font-bold text-[#1A2440]">
            <span>{data.storeName}</span>
          </p>
        </span>
        <Link
          href={storeHref}
          prefetch
          className="pro-btn-soft whitespace-nowrap"
          onClick={(e) => {
            if (!data?.slug) {
              e.preventDefault();
              toast.error("Store slug not found!");
            }
          }}
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default BannerCard;
