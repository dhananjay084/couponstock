"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import CouponModal from "../modals/couponModels";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Coupons_Deals = ({ border, disabled, data }) => {
  if (!data) return null;

  const router = useRouter();
  const { dealDescription, dealImage, homePageTitle, dealCategory } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    if (disabled) {
      toast.error("This deal is currently unavailable!");
      return;
    }
    setModalOpen(true);
  };

  const handleDealClick = () => {
    if (!data?._id) {
      toast.error("Deal ID missing!");
      return;
    }
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <>
      <div className="relative">

        {/* MAIN CARD */}
        <div
          className={`flex items-center gap-4 px-4 py-4 mx-2 rounded-xl transition-all duration-200 
            ${border ? "border-2 border-[#f1f1f1] shadow-[0px_2px_10px_rgba(202,202,202,1)]" : ""}
            ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
          `}
        >
          {/* Image Section */}
          <div className="relative w-[120px] h-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-white">
            <img
              src={dealImage || "/default-deal.jpg"}
              alt="Deal"
              className="w-full h-full"
            />
            {disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg" />
            )}
          </div>

          {/* Text + Button */}
          <div className="flex flex-col justify-between h-full flex-1 overflow-hidden">
            <div>
              <Typography
                variant="subtitle2"
                sx={{
                  color: disabled ? "#999" : "#592EA9",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
                noWrap
              >
                {homePageTitle || "Untitled Deal"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: disabled ? "#aaa" : "#444",
                  fontSize: "11px",
                  lineHeight: "1.4",
                }}
                className="line-clamp-2"
              >
                {dealDescription || "No description available."}
              </Typography>
            </div>

            {/* Action Button */}
            <button
              onClick={
                dealCategory === "coupon" ? handleCardClick : handleDealClick
              }
              disabled={disabled}
              className={`
                mt-3 self-start px-4 py-1.5 text-sm rounded-md shadow
                ${disabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E9E4F4] text-[#592EA9] hover:bg-[#dcd4ee]"}
              `}
            >
              {dealCategory === "coupon" ? "Code" : "View"}
            </button>
          </div>
        </div>

        {/* ✔ STORE TAG ON BOTTOM RIGHT – EXACT STYLE FROM IMAGE */}
        {data?.store && (
          <div
            className="absolute bottom-0 right-2 
            bg-[#592EA9] 
            text-[#fff] 
            px-5 py-3 text-xs font-semibold
            rounded-tl-lg
            rounded-br-lg
            shadow-sm"
            style={{
              border: "1px solid #C7D7FF",
            }}
          >
            {data.store}
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
      />
    </>
  );
};

Coupons_Deals.defaultProps = {
  border: false,
  disabled: false,
};

export default Coupons_Deals;
