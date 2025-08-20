"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PopularBrandCardWithText = ({ data = {} }) => {
  const router = useRouter();

  const storeName = data.storeName || data.homePageTitle || "Store Name";
  const storeImage =
    data.storeImage || data.dealImage || "https://via.placeholder.com/250x160?text=No+Image";
  const discountPercentage = data.discountPercentage || data.discount || "0%";
  const storeDescription = data.storeDescription || data.dealDescription || "No description available";

  const handleCardClick = () => {
    if (data._id) {
      if (data.storeName) {
        router.push(`/store/${data._id}`);
      } else {
        router.push(`/deal/${data._id}?category=${data.categorySelect}`);
      }
    }
  };

  return (
    <div>
      <div className="relative border border-[#cacaca] rounded-lg shadow-lg flex-shrink-0 w-[200px] md:w-[220px] lg:w-[250px] overflow-hidden">
        <img
          src={storeImage}
          className="w-full h-[120px] md:h-[140px] lg:h-[160px] object-fill rounded-lg"
          alt={storeName}
        />
        <div className="absolute bottom-3 right-5 z-10">
          <button
            className="bg-[#E9E4F4] rounded-lg px-4 py-2 text-[#592EA9] shadow-lg cursor-pointer"
            onClick={handleCardClick}
          >
            View
          </button>
        </div>
      </div>
      <div className="my-2 text-white">
        <p>{storeName}</p>
        <p>{`${discountPercentage}% OFF`}</p>
        <p>{storeDescription?.substring(0, 40)}...</p>
      </div>
    </div>
  );
};

export default PopularBrandCardWithText;
