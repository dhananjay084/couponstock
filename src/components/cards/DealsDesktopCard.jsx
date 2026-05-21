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
      <div className="coupon-banner-card w-full min-w-[322px] max-w-sm">
        <div className="coupon-media-frame aspect-[16/10]">
          <img
            src={data.dealImage}
            alt="Promotion"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="coupon-chip coupon-chip-hot">
              {data.dealCategory === "deal" ? "Deal" : "Coupon"}
            </span>
            {data?.store ? <span className="coupon-chip coupon-chip-cashback max-w-[150px] truncate">{data.store}</span> : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <p className="line-clamp-2 text-base font-extrabold text-[#172338]">{data.homePageTitle}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#61718a]">
              {data.dealDescription || "Unlock this offer and save more on your next checkout."}
            </p>
          </div>

          {data.dealCategory === "deal" ? (
            <CountryLink
              href={dealHref}
              prefetch={false}
              className="pro-btn-soft mt-auto self-start whitespace-nowrap"
              onClick={(e) => {
                if (!data?._id) {
                  e.preventDefault();
                  toast.error("Deal ID is missing!");
                }
              }}
            >
              Get Deal
            </CountryLink>
          ) : (
            <button
              className="coupon-code-button mt-auto self-start whitespace-nowrap"
              onClick={handleModalClick}
            >
              {data?.couponCode ? `Code: ${String(data.couponCode).slice(0, 10)}` : "Show Code"}
            </button>
          )}
        </div>
      </div>

      <CouponModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} />
    </>
  );
};

export default BannerCard;
