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

  const handleCopyAndGo = async () => {
    if (data?.couponCode) {
      await navigator.clipboard.writeText(data.couponCode);
    }
    if (data?.redirectionLink) {
      window.open(data.redirectionLink, "_blank");
    }
  };

  const expiryText = data?.expiredDate
    ? new Date(data.expiredDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

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
          {data.store || "Store Name"}
        </Typography>

        <div className="mt-2 text-sm text-gray-700">
          <div>{data.dealTitle || data.homePageTitle || "—"}</div>
          <div className="mt-1">
            <strong>Discount:</strong> {data.discount || "—"}
          </div>
        </div>

        {/* Code section */}
        <div className="border border-dashed border-[#6c38d9] p-2 rounded-xl mt-3 flex items-center justify-between text-sm">
          <span className="font-mono text-[#6c38d9]">
            {data.couponCode || "NO-CODE"}
          </span>
          <button
            onClick={handleCopyAndGo}
            className="text-[#6c38d9] underline cursor-pointer"
          >
            Copy & Go
          </button>
        </div>

        {/* Details */}
        <div className="mt-4 flex items-center justify-between">
          <Typography className="text-sm text-[#6c38d9] underline cursor-pointer">
            <p onClick={handleCardClick}>See Details</p>
          </Typography>
          <span className="text-xs text-gray-500">
            Expiry: {expiryText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
