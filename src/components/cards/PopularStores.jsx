"use client";

import React from "react";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const PopularStores = ({ data }) => {
  if (!data) return null;

  const { discountPercentage, storeImage, slug, storeName } = data;
  const storeHref = slug ? `/store/${slug}` : "#";

  return (
    <div className="w-[236px] flex-shrink-0 md:w-[250px] lg:w-[272px]">
      <div className="coupon-banner-card h-full overflow-hidden">
        <div className="coupon-media-frame relative flex h-[164px] items-center justify-center p-6 md:h-[176px] lg:h-[188px]">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.86)_100%)]" />
          <img
            src={storeImage || "/default-store.jpg"}
            className="relative z-[1] h-[96px] w-[96px] rounded-[26px] border border-white/80 bg-white p-2 object-contain shadow-[0_16px_36px_rgba(79,54,154,0.16)]"
            alt={storeName || "Store"}
          />
          {typeof discountPercentage === "number" && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-[#14a44d] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(20,164,77,0.24)]">
              Up to {discountPercentage}% off
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2">
            <span className="coupon-chip coupon-chip-muted">Popular Store</span>
            <p className="line-clamp-2 min-h-[48px] text-[16px] font-extrabold leading-6 text-[#172338]">
              {storeName || "Store"}
            </p>
            <p className="line-clamp-2 min-h-[40px] text-[12px] leading-5 text-[#65748d]">
              Fresh coupons, smart brand offers, and easy savings collected in one place.
            </p>
          </div>

          <CountryLink
            href={storeHref}
            prefetch
            className="pro-btn-soft mt-auto self-start text-xs"
            onClick={(e) => {
              if (!slug) {
                e.preventDefault();
                toast.error("Store slug not found!");
              }
            }}
          >
            View Offers
          </CountryLink>
        </div>
      </div>
    </div>
  );
};

export default PopularStores;
