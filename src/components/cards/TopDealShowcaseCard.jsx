"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiExternalLink } from "react-icons/fi";
import CountryLink from "../Minor/CountryLink";
import { slugify } from "../../lib/slugify";
import { addCountryPrefix } from "../../lib/countryPath";

const TopDealShowcaseCard = ({ deal, store }) => {
  if (!deal) return null;
  const router = useRouter();
  const { selectedCountry } = useSelector((state) => state.country || {});

  const urlSlug = deal?.slug || deal?._id;
  const dealHref = urlSlug
    ? `/deal/${urlSlug}${deal?.categorySelect ? `?category=${deal.categorySelect}` : ""}`
    : "#";

  const storeName = store?.storeName || deal?.store || "Store";
  const derivedStoreSlug = store?.slug || (deal?.store ? slugify(deal.store) : "");
  const storeHref = derivedStoreSlug ? `/store/${derivedStoreSlug}` : "/store";
  const resolvedDealHref = addCountryPrefix(dealHref, selectedCountry || "");

  const handleCardOpen = () => {
    if (!urlSlug) return;
    router.push(resolvedDealHref);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardOpen();
    }
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="coupon-spotlight-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3CC4]/40"
      role="link"
      tabIndex={0}
      onClick={handleCardOpen}
      onKeyDown={handleCardKeyDown}
    >
      <div className="block flex-1">
        <div className="flex min-h-[214px] items-stretch sm:min-h-[226px]">
          <div className="flex w-[122px] flex-shrink-0 items-center justify-center bg-[linear-gradient(180deg,#f8f2ff_0%,#eef5ff_100%)] p-4 sm:w-[148px]">
            {deal?.dealImage ? (
              <Image
                src={deal.dealImage}
                alt={deal?.homePageTitle || storeName}
                width={220}
                height={220}
                className="h-[92px] w-full rounded-[20px] object-contain sm:h-[110px]"
                unoptimized={String(deal.dealImage).startsWith("http")}
              />
            ) : (
              <div className="flex h-[92px] w-full items-center justify-center rounded-[20px] bg-[#f3ecff] text-center text-xs font-extrabold uppercase tracking-wide text-[#5b33d6] sm:h-[110px]">
                {storeName}
              </div>
            )}
          </div>

          <div className="mx-0 my-5 w-[1px] border-l border-dashed border-[#dbe3ef]" />

          <div className="flex flex-1 flex-col justify-center px-4 py-5 sm:px-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="coupon-chip coupon-chip-hot">Top pick</span>
              <span className="coupon-chip coupon-chip-cashback">{deal?.dealCategory === "coupon" ? "Code available" : "Instant deal"}</span>
            </div>
            <p className="line-clamp-2 min-h-[44px] text-[15px] font-extrabold leading-snug text-[#1B2436] sm:min-h-[48px] sm:text-[18px]">
              {deal?.homePageTitle || "Top Deal"}
            </p>
            <p className="mt-2 line-clamp-2 min-h-[34px] text-[12px] leading-relaxed text-[#5A667E] sm:min-h-[38px] sm:text-[13px]">
              {deal?.dealDescription || "Limited time offer. Tap to view details."}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#e8eef8]" />

      <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
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
          prefetch
          onClick={stopPropagation}
          className="inline-flex min-w-0 flex-1 items-center justify-between gap-2 text-[13px] font-semibold text-[#2F6FED] hover:underline"
        >
          <span className="line-clamp-1">View All {storeName} Coupons</span>
          <FiExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden />
        </CountryLink>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleCardOpen();
          }}
          className="pro-btn-soft hidden sm:inline-flex"
        >
          Open
        </button>
      </div>
    </div>
  );
};

export default TopDealShowcaseCard;
