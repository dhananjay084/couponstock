"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const PopularBrandCard = ({ data }) => {
  if (!data) {
    toast.error("Brand data not found!");
    return null;
  }

  const { storeImage, storeName, slug } = data;
  const storeHref = slug ? `/store/${slug}` : "#";

  return (
    <div className="w-[220px] flex-shrink-0 md:w-[240px] lg:w-[260px]">
      <div className="coupon-banner-card h-full">
        <div className="coupon-media-frame h-[148px] md:h-[164px] lg:h-[176px]">
          <img
            src={storeImage || "/default-store.jpg"}
            className="h-full w-full object-cover"
            alt={storeName || "Brand"}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <span className="coupon-chip coupon-chip-muted">Popular</span>
            <p className="mt-3 line-clamp-2 min-h-[48px] text-[15px] font-extrabold text-[#172338]">{storeName}</p>
          </div>
          <CountryLink
            href={storeHref}
            prefetch
            className="pro-btn-soft mt-auto self-start"
            onClick={(e) => {
              if (!slug) {
                e.preventDefault();
                toast.error("Store slug not found!");
              }
            }}
          >
            Explore Store
          </CountryLink>
        </div>
      </div>
    </div>
  );
};

export default PopularBrandCard;
