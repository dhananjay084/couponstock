"use client";

import React from "react";
import { useRouter } from "next/navigation";

const DealCard = ({ data }) => {
  if (!data) return null;

  const router = useRouter();

  const {
    dealDescription,
    dealImage,
    homePageTitle,
  } = data;

  const handleCardClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <div className="flex gap-4 mx-4 border border-[#cacaca] rounded-lg shadow-lg min-w-[277px] max-w-[450px]">
      <img
        src={dealImage && dealImage  }
        alt="Deal Image"
        className="min-w-[105px] object-fill rounded-lg"
      />
      <div className="px-4 py-1 min-w-1/2">
        <p className="text-sm">{homePageTitle ? homePageTitle : ""}</p>
        <p className="text-[10px] text-[#222]">
          {dealDescription ? dealDescription.substring(0, 50) : ""}
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
