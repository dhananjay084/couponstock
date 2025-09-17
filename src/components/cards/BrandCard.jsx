"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DealCard = ({ data }) => {
  const router = useRouter();

  if (!data) return null;

  const { storeDescription, storeImage } = data;

  const handleCardClick = () => {
    if (!data?._id) {
      toast.error("Store not found!");
      return;
    }
    router.push(`/store/${data._id}`);
  };

  return (
    <div className="flex items-center mx-4 border border-[#cacaca] rounded-lg shadow-md min-w-[277px] max-w-[450px] bg-white overflow-hidden">
      {/* Image Section */}
      <div className="w-[110px] h-[110px] flex-shrink-0 bg-white flex items-center justify-center p-2">
        <img
          src={storeImage || "/default-store.jpg"}
          alt="Store"
          className="w-full h-full  rounded-md"
        />
      </div>

      {/* Text and Button Section */}
      <div className="flex flex-col justify-between p-3 flex-1">
        <p className="text-xs text-[#222] line-clamp-3">
          {storeDescription || "No description available."}
        </p>

        <button
          onClick={handleCardClick}
          className="bg-[#592EA921] text-[#592EA9] text-sm rounded-md px-4 py-1.5 shadow mt-3 self-start"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default DealCard;
