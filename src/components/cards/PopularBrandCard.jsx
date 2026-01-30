"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PopularBrandCard = ({ data }) => {
  if (!data) {
    toast.error("Brand data not found!");
    return null;
  }

  const router = useRouter();
  const { storeImage, storeName, slug } = data;

  const handleCardClick = () => {
    console.log("card clicked")
    if (!slug) {
      toast.error("Store slug not found!");
      return;
    }
    router.push(`/store/${slug}`);
  };

  return (
    <div>
      <div className="relative border border-[#cacaca] rounded-lg shadow-lg flex-shrink-0 w-[200px] md:w-[220px] lg:w-[250px] overflow-hidden">
        <img
          src={storeImage || "/default-store.jpg"}
          className="w-full h-[120px] md:h-[140px] lg:h-[160px] object-fill rounded-lg"
          alt={storeName || "Brand"}
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
      <div className="my-2 text-[#592EA9]">
        <p>{storeName}</p>
      </div>
    </div>
  );
};

export default PopularBrandCard;
