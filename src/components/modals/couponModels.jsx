"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const CouponModal = ({ open, onClose, data }) => {
  const router = useRouter();

  if (!open) return null;

  const handleCardClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative border-[2px] border-[#6c38d9]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black text-lg font-bold cursor-pointer"
        >
          ×
        </button>

        {/* Content */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {data.store}
        </Typography>

        <div className="flex gap-2 text-sm my-2">
          <span className="font-bold text-[#6c38d9]">{data.discount}% OFF</span>
        </div>

        {/* Code section */}
        <div className="border border-dashed border-[#6c38d9] p-2 rounded-xl mt-2 flex items-center justify-between text-sm">
          <span>
            <strong>{data.discount}% OFF</strong> with Code{" "}
            <strong>{data.couponCode}</strong>
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(data.couponCode)}
            className="text-[#6c38d9] underline cursor-pointer"
          >
            Copy
          </button>
        </div>

        {/* Details */}
        <Typography className="mt-4 text-sm text-[#6c38d9] underline cursor-pointer">
          <p onClick={handleCardClick}>See Details</p>
        </Typography>
      </div>
    </div>
  );
};

export default CouponModal;
