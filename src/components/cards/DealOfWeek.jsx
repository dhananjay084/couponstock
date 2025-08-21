"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const DealOfWeek = ({ data }) => {
  // if (!data) return null;

   if (!data) {
      toast.error("Deal not found!");
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
      <div className="rounded-lg bg-white shadow-[0px_2px_10.3px_0px_rgba(0,0,0,0.25)] relative w-full h-[100px]">
        <Image
          src={dealImage || "/default-deal.jpg"}
          alt={homePageTitle || "Deal Image"}
          fill
          style={{ objectFit: "fill" }}
          className="rounded-lg"
        />
      </div>
      <Typography color="#592ea9" className="truncate">
        {homePageTitle}
      </Typography>
    </div>
  );
};

export default DealOfWeek;
