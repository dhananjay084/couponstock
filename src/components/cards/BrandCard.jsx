"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const DealCard = ({ data }) => {
  if (!data) return null;

  const { storeDescription, storeImage, storeName, discountPercentage } = data;
  const storeHref = data?.slug ? `/store/${data.slug}` : "#";
  

  return (
    <div className="coupon-offer-card mx-4 min-w-[286px] max-w-[430px] items-stretch">
      <div className="coupon-offer-media">
        <img
          src={storeImage || "/default-store.jpg"}
          alt="Store"
          className="h-[84px] w-[84px] rounded-[20px] object-contain"
        />
      </div>

      <div className="coupon-offer-body">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="coupon-chip coupon-chip-muted">Top Store</span>
          {typeof discountPercentage === "number" ? (
            <span className="coupon-chip coupon-chip-cashback">{discountPercentage}% off</span>
          ) : null}
        </div>

        <p className="coupon-card-title line-clamp-1 text-[0.98rem]">{storeName || "Store"}</p>
        <p className="coupon-card-copy mt-2 line-clamp-3 min-h-[58px] text-[12px] leading-5">
          {storeDescription || "No description available."}
        </p>

        <CountryLink
          href={storeHref}
          prefetch
          className="pro-btn-soft mt-auto self-start"
          onClick={(e) => {
            if (!data?.slug) {
              e.preventDefault();
              toast.error("Store slug not found!");
            }
          }}
        >
          View
        </CountryLink>
      </div>
    </div>
  );
};

export default DealCard;
