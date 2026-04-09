"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DealOfWeek = ({ data }) => {
  if (!data) {
    // toast.error("Deal not found!");
    return null;
  }

  const router = useRouter();
  const { dealImage, homePageTitle } = data;

  const handleCardClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <div
      className="w-[15%] min-w-[125px] cursor-pointer space-y-1 text-xs"
      onClick={handleCardClick}
    >
      <div className="pro-card relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={dealImage || "/default-deal.jpg"}
          alt={homePageTitle || "Deal Image"}
          fill
          className="object-cover"
        />
      </div>
      <Typography color="#4B3A80" className="truncate text-[11px] font-semibold">
        {homePageTitle}
      </Typography>
    </div>
  );
};

export default DealOfWeek;
