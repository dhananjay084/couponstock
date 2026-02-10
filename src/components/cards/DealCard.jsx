"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DealCard = ({ data }) => {
  if (!data) {
    console.error("DealCard: No data provided");
    return null;
  }

  const router = useRouter();
  const { dealDescription, dealImage, homePageTitle, store, categorySelect, _id, slug } = data;

  const handleCardClick = () => {
    if (!_id) {
      toast.error("Deal ID is missing!");
      return;
    }
    
    // ✅ UPDATED: Use slug instead of _id with fallback
    const urlSlug = slug || _id;
    
    // Build the URL with category parameter
    const url = `/deal/${urlSlug}${categorySelect ? `?category=${categorySelect}` : ''}`;
    
    console.log("Navigating to:", url); // For debugging
    router.push(url);
  };

  return (
    <div className="relative w-fit">
      {/* ✅ STORE TAG */}
      {store && (
        <div
          className="absolute bottom-0 right-4 
          bg-[#592EA9] 
          text-white text-xs font-semibold 
          px-2 py-1
          rounded-tl-lg rounded-br-lg 
          shadow-sm z-10"
          style={{ border: "1px solid #C7D7FF" }}
        >
          {store}
        </div>
      )}

      {/* MAIN CARD */}
      <div 
        className="flex mx-4 border border-[#cacaca] rounded-lg shadow-lg min-w-[277px] max-w-[450px] overflow-hidden bg-white cursor-pointer hover:shadow-xl transition-shadow duration-300"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Image Section */}
        <div className="w-[110px] flex-shrink-0 bg-white flex items-center justify-center p-2">
          <Image
            src={dealImage || "/default-deal.jpg"}
            alt={homePageTitle || "Deal Image"}
            width={100}
            height={100}
            className="w-full h-full object-contain"
            unoptimized={dealImage?.includes('http')} // For external images
            priority={false}
          />
        </div>

        {/* Text + Button Section */}
        <div className="flex flex-col justify-between p-3 flex-1">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#222] line-clamp-1">
              {homePageTitle || "Untitled Deal"}
            </p>
            <p className="text-[11px] text-[#444] line-clamp-2">
              {dealDescription || "No description available"}
            </p>
          </div>

          <button
            className="bg-[#592EA921] text-[#592EA9] text-sm rounded-md px-4 py-1.5 shadow mt-2 self-start hover:bg-[#592EA935] transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              handleCardClick();
            }}
            aria-label={`View ${homePageTitle || 'deal'}`}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;