"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import CouponModal from "../modals/couponModels";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const Coupons_Deals = ({ border, disabled, data }) => {
  if (!data) return null;

  const { dealDescription, dealImage, homePageTitle, dealCategory } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    if (disabled) {
      toast.error("This deal is currently unavailable!");
      return;
    }
    setModalOpen(true);
  };

  const dealHref = data?._id ? `/deal/${data._id}?category=${data.categorySelect}` : "#";

  return (
    <>
      <div className="relative">
        {/* MAIN CARD */}
        <div
          className={`relative mx-2 flex items-center gap-4 overflow-hidden rounded-xl px-4 py-4 transition-all duration-200 
            ${border ? "pro-card" : ""}
            ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
          `}
        >
          {/* Image Section */}
          <div className="relative w-[120px] h-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-white">
            <img
              src={dealImage || "/default-deal.jpg"}
              alt="Deal"
              className="w-full h-full object-cover"
            />
            {disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg" />
            )}
          </div>

          {/* Store Tag */}
          {data?.store && (
            <div
              className="absolute bottom-2 right-2 z-10 max-w-[70%] truncate rounded-tl-xl rounded-br-xl bg-[#5B3CC4] px-4 py-2 text-[11px] font-semibold text-white shadow-sm"
              style={{ border: "1px solid #D7C8FF" }}
            >
              {data.store}
            </div>
          )}

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
            {dealCategory === "coupon" ? (
              <button
                onClick={handleCardClick}
                disabled={disabled}
                className={`
                  mt-3 self-start px-4 py-1.5 text-sm rounded-md shadow
                  ${disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F2EBFF] text-[#5B3CC4] border border-[#DCCEFF] hover:bg-[#EADFFF]"}
                `}
              >
                Code
              </button>
            ) : (
              <CountryLink
                href={dealHref}
                prefetch
                onClick={(e) => {
                  if (!data?._id) {
                    e.preventDefault();
                    toast.error("Deal ID missing!");
                  }
                }}
                className="mt-3 self-start rounded-md border border-[#DCCEFF] bg-[#F2EBFF] px-4 py-1.5 text-sm text-[#5B3CC4] shadow hover:bg-[#EADFFF]"
              >
                View
              </CountryLink>
            )}
          </div>
        </div>
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
