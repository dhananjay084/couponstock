"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import CouponModal from "../modals/couponModels";
import { useRouter } from "next/navigation";

const Coupons_Deals = ({ border, disabled, data }) => {
  if (!data) return null;

  const router = useRouter();
  const { dealDescription, dealImage, homePageTitle } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    if (!disabled) setModalOpen(true);
  };

  const handleDealClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <>
      <div
        className={`flex gap-4 items-center px-4 cursor-pointer ${
          border
            ? "border-2 py-4 rounded-xl border-[#f1f1f1] mx-2 shadow-[0px_2px_10px_rgba(202,202,202,1)]"
            : ""
        }`}
      >
        {/* Image */}
        <div
          className={`relative ${border ? "max-w-[50%]" : "max-w-[35%]"} rounded-lg overflow-hidden`}
        >
          <img src={dealImage} className="rounded-lg w-full max-h-[150px]" />
          {disabled && <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>}
        </div>

        {/* Text Content */}
        <div>
          <Typography
            color={disabled ? "disabled" : "#592ea9"}
            sx={{ fontWeight: 500, fontSize: "13px" }}
          >
            {homePageTitle ? homePageTitle.substring(0, 20) : ""}
          </Typography>
          <Typography
            color={disabled ? "disabled" : "black"}
            sx={{ fontWeight: 500, fontSize: "10px" }}
          >
            {dealDescription ? dealDescription.substring(0, 50) : ""}
          </Typography>

          {data.dealCategory === "coupon" ? (
            <button
              style={{
                backgroundColor: disabled ? "#b9b9b9" : "#E9E4F4",
                color: disabled ? "#AAA6B1" : "#592EA9",
              }}
              className="rounded-lg px-4 py-2 shadow-lg mt-2"
              onClick={handleCardClick}
            >
              Coupon Code
            </button>
          ) : (
            <button
              style={{
                backgroundColor: disabled ? "#b9b9b9" : "#E9E4F4",
                color: disabled ? "#AAA6B1" : "#592EA9",
              }}
              className="rounded-lg px-4 py-2 shadow-lg mt-2"
              onClick={handleDealClick}
            >
              View
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <CouponModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} />
    </>
  );
};

Coupons_Deals.defaultProps = {
  border: false,
  disabled: false,
};

export default Coupons_Deals;
