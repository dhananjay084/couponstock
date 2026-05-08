"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { addCountryPrefix } from "../../lib/countryPath";

const DealOfWeek = ({ data }) => {
  if (!data) {
    // toast.error("Deal not found!");
    return null;
  }

  const router = useRouter();
  const { selectedCountry } = useSelector((state) => state.country || {});
  const { dealImage, homePageTitle } = data;

  const handleCardClick = () => {
    const href = `/deal/${data._id}?category=${data.categorySelect}`;
    router.push(addCountryPrefix(href, selectedCountry || ""));
  };

  return (
    <div
      className="w-full min-w-0 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="coupon-banner-card h-full overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={dealImage || "/default-deal.jpg"}
            alt={homePageTitle || "Deal Image"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.55)_100%)]" />
          <div className="absolute left-3 top-3">
            <span className="coupon-chip coupon-chip-hot">Weekly</span>
          </div>
        </div>
        <div className="flex min-h-[84px] flex-col justify-between p-3">
          <Typography color="#172338" className="line-clamp-2 min-h-[40px] text-[13px] font-bold leading-5">
            {homePageTitle}
          </Typography>
          <span className="mt-3 inline-flex w-fit rounded-full bg-[#f4edff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6337c6]">
            Explore deal
          </span>
        </div>
      </div>
    </div>
  );
};

export default DealOfWeek;
