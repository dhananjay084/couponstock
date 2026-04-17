"use client";

import React from "react";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import CountryLink from "../Minor/CountryLink";

const TopDealShowcaseCard = ({ deal, store }) => {
  if (!deal) return null;

  const urlSlug = deal?.slug || deal?._id;
  const dealHref = urlSlug
    ? `/deal/${urlSlug}${deal?.categorySelect ? `?category=${deal.categorySelect}` : ""}`
    : "#";

      const storeName = store?.storeName || deal?.store || "Store";
      const storeHref = store?.slug ? `/store/${store.slug}` : "/store";

  return (
    <div className="pro-card flex h-full w-full flex-col overflow-hidden">
      <CountryLink
        href={dealHref}
        prefetch
        className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CC4]/40"
      >
        <div className="flex min-h-[172px] items-stretch bg-white sm:min-h-[190px]">
          <div className="flex w-[120px] flex-shrink-0 items-center justify-center p-4 sm:w-[150px]">
            {deal?.dealImage ? (
              <Image
                src={deal.dealImage}
                alt={deal?.homePageTitle || storeName}
                width={220}
                height={220}
                className="h-[92px] w-full object-contain sm:h-[110px]"
                unoptimized={String(deal.dealImage).startsWith("http")}
              />
            ) : (
              <div className="flex h-[92px] w-full items-center justify-center rounded-xl bg-[#F6F1FF] text-center text-xs font-extrabold uppercase tracking-wide text-[#5B3CC4] sm:h-[110px]">
                {storeName}
              </div>
            )}
          </div>

          <div className="mx-0 my-4 w-[1px] border-l border-dashed border-[#D7DCEB]" />

          <div className="flex flex-1 flex-col justify-center px-4 py-5 sm:px-5">
            <p className="line-clamp-2 min-h-[40px] text-[15px] font-extrabold leading-snug text-[#1B2436] sm:min-h-[48px] sm:text-[18px]">
              {deal?.homePageTitle || "Top Deal"}
            </p>
            <p className="mt-1 line-clamp-2 min-h-[34px] text-[12px] leading-relaxed text-[#5A667E] sm:min-h-[38px] sm:text-[13px]">
              {deal?.dealDescription || "Limited time offer. Tap to view details."}
            </p>
          </div>
        </div>
      </CountryLink>

      <div className="h-[1px] w-full bg-[#E7F0FF]" />

      <div className="flex items-center gap-3 bg-white px-4 py-3 sm:px-5">
        <div className="flex h-12 w-16 items-center justify-center rounded-2xl border border-[#EEF2FF] bg-[#FBFCFF] shadow-[0_6px_14px_rgba(15,23,42,0.06)]">
          {store?.storeImage ? (
            <Image
              src={store.storeImage}
              alt={storeName}
              width={64}
              height={64}
              className="h-9 w-12 object-contain"
              unoptimized={String(store.storeImage).startsWith("http")}
            />
          ) : (
            <span className="text-sm font-extrabold text-[#1B2436]">
              {String(storeName).slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        <CountryLink
          href={storeHref}
          className="inline-flex min-w-0 flex-1 items-center justify-between gap-2 text-[13px] font-semibold text-[#2F6FED] hover:underline"
        >
          <span className="line-clamp-1">View All {storeName} Coupons</span>
          <FiExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden />
        </CountryLink>
      </div>
    </div>
  );
};

export default TopDealShowcaseCard;
