"use client";

import React from "react";
import { useRouter } from "next/navigation";

const DealCard = ({ data }) => {
  if (!data) return null;

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/store/${data._id}`);
  };

  const { storeDescription, storeImage } = data;

  return (
    <div className="flex gap-4 mx-4 border border-[#cacaca] rounded-lg shadow-lg min-w-[277px]">
      <img
        src={storeImage}
        alt="Store Image"
        className="max-w-[105px] object-fill rounded-lg"
      />
      <div className="p-4">
        <p className="text-[10px] text-[#222]">
          {storeDescription ? storeDescription.substring(0, 50) : ""}
        </p>
        <button
          className="bg-[#592EA921] rounded-lg px-4 py-2 text-[#592EA9] shadow-lg mt-2"
          onClick={handleCardClick}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default DealCard;
