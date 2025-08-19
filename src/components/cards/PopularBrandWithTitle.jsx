"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PopularBrandCard = ({ data }) => {
  if (!data) return null;

  const router = useRouter();
  const { storeImage, storeName } = data;

  const handleCardClick = () => {
    router.push(`/store/${data._id}`);
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="relative border border-[#cacaca] rounded-lg shadow-lg w-full overflow-hidden">
        <img
          src={storeImage}
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
      <div className="my-2 text-[#592EA9] px-2">
        <p>{storeName}</p>
      </div>
    </div>
  );
};

export default PopularBrandCard;
