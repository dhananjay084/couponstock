"use client";

import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const DealCard = ({ data }) => {
  if (!data) {
    console.error("DealCard: No data provided");
    return null;
  }

  const { dealDescription, dealImage, homePageTitle, store, categorySelect, _id, slug, dealCategory } = data;
  const urlSlug = slug || _id;
  const dealHref = `/deal/${urlSlug}${categorySelect ? `?category=${categorySelect}` : ""}`;
  const offerType = dealCategory === "coupon" ? "Coupon" : "Deal";

  return (
    <CountryLink
      href={dealHref}
      prefetch
      className="coupon-offer-card mx-4 min-w-[286px] max-w-[430px] flex-shrink-0 cursor-pointer"
    >
      <div className="coupon-offer-media">
        <Image
          src={dealImage || "/default-deal.jpg"}
          alt={homePageTitle || "Deal Image"}
          width={100}
          height={100}
          className="h-[82px] w-[82px] rounded-[20px] object-contain"
          unoptimized={dealImage?.includes("http")}
          priority={false}
        />
      </div>

      <div className="coupon-offer-body">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="coupon-chip coupon-chip-hot">{offerType}</span>
          {store ? <span className="coupon-chip coupon-chip-muted max-w-[150px] truncate">{store}</span> : null}
        </div>

        <div className="space-y-2">
          <p className="coupon-card-title line-clamp-2 min-h-[44px] text-[0.98rem]">
            {homePageTitle || "Untitled Deal"}
          </p>
          <p className="coupon-card-copy line-clamp-3 min-h-[58px] text-[12px] leading-5">
            {dealDescription || "No description available"}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8793a9]">
            Verified offer
          </p>
          <span
            className="pro-btn-soft"
            onClick={(e) => {
              if (!_id) {
                e.preventDefault();
                toast.error("Deal ID is missing!");
              }
            }}
            aria-label={`View ${homePageTitle || "deal"}`}
          >
            {dealCategory === "coupon" ? "Show Code" : "Get Deal"}
          </span>
        </div>
      </div>
    </CountryLink>
  );
};

export default DealCard;
