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

  const { dealDescription, dealImage, homePageTitle, store, categorySelect, _id, slug } = data;
  const urlSlug = slug || _id;
  const dealHref = `/deal/${urlSlug}${categorySelect ? `?category=${categorySelect}` : ""}`;

  const handleCardClick = () => {
    if (!_id) {
      toast.error("Deal ID is missing!");
      return;
    }
  };

  return (
    <CountryLink
      href={dealHref}
      prefetch
      className="pro-card relative mx-4 flex min-w-[277px] max-w-[460px] flex-shrink-0 cursor-pointer overflow-hidden"
    >
      {store && (
        <div className="absolute bottom-2 right-2 z-10 max-w-[70%] truncate rounded-full border border-[#CDBBFF] bg-[#5B3CC4] px-2.5 py-1 text-[10px] font-semibold text-white shadow">
          {store}
        </div>
      )}

      <div className="flex w-[118px] flex-shrink-0 items-center justify-center bg-white p-2.5">
        <Image
          src={dealImage || "/default-deal.jpg"}
          alt={homePageTitle || "Deal Image"}
          width={100}
          height={100}
          className="h-full w-full object-contain"
          unoptimized={dealImage?.includes("http")} // For external images
          priority={false}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div className="space-y-1.5">
          <p className="line-clamp-1 text-sm font-bold text-[#1E2635]">
            {homePageTitle || "Untitled Deal"}
          </p>
          <p className="line-clamp-2 text-[11px] text-[#5A667E]">
            {dealDescription || "No description available"}
          </p>
        </div>

        <button
          className="pro-btn-soft mt-2 self-start"
          onClick={(e) => {
            if (!_id) {
              e.preventDefault();
              toast.error("Deal ID is missing!");
            }
          }}
          aria-label={`View ${homePageTitle || "deal"}`}
        >
          View
        </button>
      </div>
    </CountryLink>
  );
};

export default DealCard;
