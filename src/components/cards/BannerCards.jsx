"use client"; // Required because we use client-side navigation

import React from "react";
import { toast } from "react-toastify";

const ProductCard = ({ data }) => {
  const handleRedirect = () => {
    if (!data?.redirectionLink) {
      toast.error("Redirection link not available!");
      return;
    }

    if (typeof window !== "undefined") {
      window.open(data.redirectionLink, "_blank", "noopener,noreferrer");
    }
  };
  

  return (
    <div
      className="coupon-banner-card h-full w-full cursor-pointer"
      onClick={handleRedirect}
      style={{
        backgroundImage: data?.dealImage
          ? `linear-gradient(180deg, rgba(9,16,30,0.08) 0%, rgba(9,16,30,0.2) 52%, rgba(9,16,30,0.78) 100%), url(${data.dealImage})`
          : "linear-gradient(180deg, #ffffff 0%, #f7faff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex min-h-[328px] flex-1 items-end p-5">
        <p className="line-clamp-2 min-h-[48px] text-left text-base font-extrabold leading-6 text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">
          {data?.homePageTitle || data?.dealTitle || "Featured offer"}
        </p>
      </div>
    </div>
  
  );
};

export default ProductCard;
