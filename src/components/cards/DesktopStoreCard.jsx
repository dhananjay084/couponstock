"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const BannerCard = ({ data }) => {
  // if (!data) return null;
   if (!data) {
    toast.error("Store data not available!");
    return null;
  }


  const router = useRouter();

  const handleCardClick = () => {
    // router.push(`/store/${data._id}`);
     if (!data?._id) {
      toast.error("Store ID is missing!");
      return;
    }
    // toast.success(`Redirecting to ${data.storeName}...`);
    router.push(`/store/${data._id}`);
  };

  return (
    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden min-w-[322px]">
      {/* Image */}
      <img
        src={data.storeImage}
        alt="Promotion"
        className="w-full h-[250px] object-fill rounded-2xl"
      />

      {/* Content */}
      <div className="p-2 flex justify-between items-center">
        <span className="max-w-[60%]">
          <p className="text-[#592EA9] font-semibold text-lg">
            <span className="text-[#592EA9] font-bold">{data.storeName}</span>
          </p>
        </span>
        <button
          className="bg-[#E5DBF9] text-[#592EA9] px-6 py-2 text-sm rounded-full shadow-md hover:bg-[#d6c6f5] transition-all cursor-pointer"
          onClick={handleCardClick}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default BannerCard;
