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
      className="text-xs space-y-1 w-[15%] min-w-[125px] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-square bg-white rounded-lg shadow-[0px_2px_10.3px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <Image
          src={dealImage || "/default-deal.jpg"}
          alt={homePageTitle || "Deal Image"}
          fill
          className="object-cover"
        />
      </div>
      <Typography color="#592ea9" className="truncate">
        {homePageTitle}
      </Typography>
    </div>
  );
};

export default DealOfWeek;
