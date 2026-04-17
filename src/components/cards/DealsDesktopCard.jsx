"use client";

import React, { useState } from "react";
import CouponModal from "../modals/couponModels";
import { toast } from "react-toastify";
import CountryLink from "../Minor/CountryLink";

const BannerCard = ({ data }) => {
  if (!data) {
    toast.error("Banner data not available!");
    return null;
  }

  const [modalOpen, setModalOpen] = useState(false);
  const urlSlug = data?.slug || data?._id;
  const dealHref = urlSlug ? `/deal/${urlSlug}?category=${data.categorySelect}` : "#";

  const handleModalClick = () => {
    if (!data) {
      toast.error("Coupon data missing!");
      return;
    }
    toast.success("Showing coupon code...");
    setModalOpen(true);
  };

  return (
    <>
      <div className="pro-card w-full min-w-[322px] max-w-sm overflow-hidden">
        <img
          src={data.dealImage}
          alt="Promotion"
          className="h-[220px] w-full object-cover"
        />

        <div className="flex items-center justify-between gap-3 p-3">
          <span className="max-w-[62%]">
            <p className="line-clamp-2 text-sm font-bold text-[#1A2440]">
              <span>{data.homePageTitle}</span>
            </p>
          </span>

          {data.dealCategory === "deal" ? (
            <CountryLink
              href={dealHref}
              prefetch
              className="pro-btn-soft whitespace-nowrap"
              onClick={(e) => {
                if (!data?._id) {
                  e.preventDefault();
                  toast.error("Deal ID is missing!");
                }
              }}
            >
              Shop Now
            </CountryLink>
          ) : (
            <button
              className="pro-btn-soft whitespace-nowrap"
              onClick={handleModalClick}
            >
              Show Code
            </button>
          )}
        </div>
      </div>

      <CouponModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} />
    </>
  );
};

export default BannerCard;
