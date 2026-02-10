"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CouponModal from "../modals/couponModels";
import { toast } from "react-toastify";

const BannerCard = ({ data }) => {
  if (!data) {
    toast.error("Banner data not available!");
    return null;
  }

  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    console.log("card clicked")
    console.log(data)
    if (!data?._id) {
      toast.error("Deal ID is missing!");
      return;
    }
    
    // ✅ UPDATED: Use slug instead of _id
    // Fallback to _id if slug doesn't exist yet
    const urlSlug = data.slug || data._id;
    
    router.push(`/deal/${urlSlug}?category=${data.categorySelect}`);
  };

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
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden min-w-[322px]">
        {/* Image */}
        <img
          src={data.dealImage}
          alt="Promotion"
          className="w-full h-[250px] object-fill rounded-2xl"
        />

        {/* Content */}
        <div className="p-2 flex justify-between items-center">
          <span className="max-w-[60%]">
            <p className="text-[#592EA9] font-semibold text-lg">
              <span className="text-[#592EA9] font-bold">{data.homePageTitle}</span>
            </p>
          </span>

          {data.dealCategory === "deal" ? (
            <button
              className="bg-[#E5DBF9] text-[#592EA9] px-6 py-2 text-sm rounded-full shadow-md hover:bg-[#d6c6f5] transition-all cursor-pointer"
              onClick={handleCardClick}
            >
              Shop Now
            </button>
          ) : (
            <button
              className="bg-[#E5DBF9] text-[#592EA9] px-6 py-2 text-sm rounded-full shadow-md hover:bg-[#d6c6f5] transition-all cursor-pointer"
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