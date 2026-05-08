"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";


const BannerCard = ({ data }) => {
  // if (!data) return null;
   if (!data) {
    toast.error("Store data not available!");
    return null;
  }

  const storeHref = data?.slug ? `/store/${data.slug}` : "#";

  return (
    <div className="coupon-banner-card w-full min-w-[322px] max-w-sm">
      <div className="coupon-media-frame aspect-[16/10]">
        <img
          src={data.storeImage}
          alt="Promotion"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4">
          <span className="coupon-chip coupon-chip-muted">Top Brand</span>
        </div>
      </div>

      <div className="flex min-h-[120px] flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="coupon-card-title line-clamp-2 text-base">
            {data.homePageTitle || data.storeName}
          </p>
          <p className="coupon-card-copy line-clamp-2 text-sm">
            {data.storeDescription || "Discover the latest savings and verified offers from this store."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          {typeof data?.discountPercentage === "number" ? (
            <div className="coupon-mini-stat">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a879d]">Best offer</p>
              <p className="mt-1 text-sm font-extrabold text-[#172338]">{data.discountPercentage}% OFF</p>
            </div>
          ) : <span />}
        <CountryLink
          href={storeHref}
          prefetch
          className="pro-btn-soft shrink-0 whitespace-nowrap"
          onClick={(e) => {
            if (!data?.slug) {
              e.preventDefault();
              toast.error("Store slug not found!");
            }
          }}
        >
          Explore
        </CountryLink>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
