"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";
import { cacheStoreDetailPayload } from "../../lib/storeDetailCache";

const PopularBrandCard = ({ data, counts, relatedDeals = [] }) => {
  if (!data) return null;

  const { storeImage, storeName, slug, discountPercentage } = data;
  const storeHref = slug ? `/store/${slug}` : "#";
  const couponCount = counts?.coupons || 0;
  const dealCount = counts?.deals || 0;
  const highlightText =
    typeof discountPercentage === "number" && discountPercentage > 0
      ? `Flat ${discountPercentage}% OFF`
      : `Coupons ${couponCount} • Deals ${dealCount}`;

  return (
    <CountryLink
      href={storeHref}
      prefetch
      className="group block h-full"
      onClick={(e) => {
        if (!slug) {
          e.preventDefault();
          toast.error("Store slug not found!");
          return;
        }

        cacheStoreDetailPayload({
          slug,
          store: data,
          deals: relatedDeals,
        });
      }}
    >
      <div className="flex h-full min-h-[228px] flex-col overflow-hidden rounded-[22px] border border-[#dddff3] bg-white shadow-[0_14px_30px_rgba(28,32,72,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_rgba(91,46,169,0.14)]">
        <div className="flex h-[132px] items-center justify-center border-b border-[#eceffd] bg-[linear-gradient(180deg,#faf8ff_0%,#f1f4ff_100%)] p-5 md:h-[144px]">
          <div className="flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-[20px] border border-[#e7e6fb] bg-white shadow-[0_10px_24px_rgba(31,37,80,0.08)]">
            <img
              src={storeImage || "/default-store.jpg"}
              className="h-[60px] w-[60px] object-contain"
              alt={storeName || "Brand"}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="min-h-[44px]">
            <p className="line-clamp-2 text-[16px] font-extrabold leading-5 text-[#1f2550]">
              {storeName || "Store"}
            </p>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-[16px] bg-[#f6f3ff] px-3 py-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[18px] shadow-[0_6px_16px_rgba(91,46,169,0.12)]">
              <span className="text-[#5b33d6]">₹</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c84a1]">
                Savings
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#4f5877]">
                {highlightText}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[#707b95]">
            <span>{couponCount} Coupons</span>
            <span>{dealCount} Deals</span>
          </div>
        </div>
      </div>
    </CountryLink>
  );
};

export default PopularBrandCard;
