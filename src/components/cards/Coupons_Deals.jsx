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
      <div className="relative h-full">
        <div
          className={`coupon-offer-card mx-2 min-h-[232px] h-full ${border ? "" : "shadow-none"} ${
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          }
          `}
        >
          <div className="coupon-offer-media">
            <img
              src={dealImage || "/default-deal.jpg"}
              alt="Deal"
              className="h-[84px] w-[84px] rounded-[20px] object-contain"
            />
            {disabled && <div className="absolute inset-0 rounded-[20px] bg-black/20" />}
          </div>

          <div className="coupon-offer-body">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="coupon-chip coupon-chip-hot">
                {dealCategory === "coupon" ? "Coupon code" : "Best deal"}
              </span>
              {data?.store ? <span className="coupon-chip coupon-chip-muted max-w-[150px] truncate">{data.store}</span> : null}
            </div>

            <div className="min-h-0 space-y-1.5">
              <Typography
                variant="subtitle2"
                sx={{
                  color: disabled ? "#8a95a8" : "#172338",
                  fontWeight: 800,
                  fontSize: "15px",
                  lineHeight: 1.35,
                  marginBottom: "6px",
                  minHeight: "2.6rem",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {homePageTitle || "Untitled Deal"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: disabled ? "#9ba7ba" : "#61718a",
                  fontSize: "12px",
                  lineHeight: "1.55",
                  minHeight: "2.4rem",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {dealDescription || "No description available."}
              </Typography>
            </div>

            {dealCategory === "coupon" ? (
              <button
                onClick={handleCardClick}
                disabled={disabled}
                className={`mt-auto self-start ${disabled ? "cursor-not-allowed rounded-[14px] border border-gray-200 bg-gray-200 px-4 py-3 text-sm text-gray-500" : "coupon-code-button"}`}
              >
                {data?.couponCode ? `Code: ${String(data.couponCode).slice(0, 10)}` : "Show Code"}
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
                className="pro-btn-soft mt-auto self-start"
              >
                View Deal
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
