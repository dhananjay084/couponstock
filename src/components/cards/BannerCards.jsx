"use client"; // Required because we use client-side navigation

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductCard = ({ data }) => {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name) => {
        const match = document.cookie.match(
          new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? decodeURIComponent(match[2]) : "";
      };

      setUserId(getCookie("userId"));
    }
  }, [router]);

  const handleRedirect = () => {
    if (!data?.redirectionLink) {
      alert("Redirection link not available!");
      return;
    }
  
    let finalUrl = data.redirectionLink;
  
    if (userId) {
      // Create timestamp string (hhmmssms)
      const now = new Date();
      const timeString =
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0") +
        String(now.getMilliseconds()).padStart(3, "0");
  
      // Append userId with TIME
      const trackedUserId = `${userId}TIME${timeString}`;
  
      // Append to URL
      finalUrl += finalUrl.includes("?")
        ? `&user_id=${encodeURIComponent(trackedUserId)}`
        : `?user_id=${encodeURIComponent(trackedUserId)}`;
    }
  
    window.open(finalUrl, "_blank"); // open in new tab
  };
  

  return (
    <div
      className="coupon-banner-card h-full w-full cursor-pointer"
      onClick={handleRedirect}
    >
      <div className="coupon-media-frame aspect-[16/10]">
        <img
          src={data.dealImage}
          alt="Product Image"
          className="block h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="coupon-chip coupon-chip-hot">
            {data?.dealCategory === "coupon" ? "Coupon" : "Deal"}
          </span>
          {data?.store ? <span className="coupon-chip coupon-chip-cashback max-w-[160px] truncate">{data.store}</span> : null}
        </div>
      </div>

      <div className="flex min-h-[130px] flex-1 flex-col gap-4 p-5">
        <div>
          <p className="line-clamp-2 text-base font-extrabold text-[#172338]">
            {data?.homePageTitle || data?.dealTitle || "Featured offer"}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#61718a]">
            {data?.dealDescription || "Open this featured promotion to view the latest verified savings."}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="coupon-mini-stat">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a879d]">Save now</p>
            <p className="mt-1 text-sm font-extrabold text-[#172338]">
              {data?.dealCategory === "coupon" ? "Use code" : "Shop offer"}
            </p>
          </div>
          <span className="pro-btn-soft">{data?.dealCategory === "coupon" ? "Show Code" : "Get Deal"}</span>
        </div>
      </div>
    </div>
  
  );
};

export default ProductCard;
