"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const Coupons_Deals = ({ border = false, data }) => {
  const router = useRouter();

  if (!data) return null;

  const handleDealClick = () => {
    router.push(`/blog/${data._id}`);
  };

  return (
    <div
      className={`flex min-w-[400px] gap-4 items-center px-4 cursor-pointer ${
        border
          ? "border-2 py-4 rounded-xl border-[#f1f1f1] mx-2 shadow-[0px_2px_10px_rgba(202,202,202,1)]"
          : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative ${border ? "max-w-[50%]" : "max-w-[35%]"} rounded-lg overflow-hidden`}
      >
        <img src={data.image} className="rounded-lg w-full max-h-[150px]" alt={data.heading} />
      </div>

      {/* Text Content */}
      <div>
        <Typography color={"#592ea9"} sx={{ fontWeight: 500, fontSize: "13px" }}>
          {`${data.heading.substring(0, 40)}..`}
        </Typography>
        <Typography color={"black"} sx={{ fontWeight: 500, fontSize: "10px" }}>
          {`${data.details.substring(0, 60)}...`}
        </Typography>

        <button
          style={{
            backgroundColor: "#E9E4F4",
            color: "#592EA9",
          }}
          className="rounded-lg px-4 py-2 shadow-lg mt-2 cursor-pointer"
          onClick={handleDealClick}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default Coupons_Deals;
