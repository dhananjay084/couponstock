"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DealCard = ({ data }) => {

  if (!data) return null;

  const router = useRouter();
  const { dealDescription, dealImage, homePageTitle } = data;

  const handleCardClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <div className="relative w-fit">

      {/* ✅ STORE TAG (same as your Coupon card) */}
      {data?.store && (
        <div
          className="absolute bottom-0 right-4 
          bg-[#592EA9] 
          text-white text-xs font-semibold 
          px-2 py-1
          rounded-tl-lg rounded-br-lg 
          shadow-sm"
          style={{ border: "1px solid #C7D7FF" }}
        >
          {data.store}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="flex mx-4 border border-[#cacaca] rounded-lg shadow-lg min-w-[277px] max-w-[450px] overflow-hidden bg-white">
        
        {/* Image Section */}
        <div className="w-[110px] flex-shrink-0 bg-white flex items-center justify-center p-2">
          <Image
            src={dealImage || "/default-deal.jpg"}
            alt="Deal Image"
            width={100}
            height={100}
            className="w-full h-full"
          />
        </div>

        {/* Text + Button Section */}
        <div className="flex flex-col justify-between p-3 flex-1">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#222] line-clamp-1">
              {homePageTitle || ""}
            </p>
            <p className="text-[11px] text-[#444] line-clamp-2">
              {dealDescription || ""}
            </p>
          </div>

          <button
            className="bg-[#592EA921] text-[#592EA9] text-sm rounded-md px-4 py-1.5 shadow mt-2 self-start"
            onClick={handleCardClick}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
