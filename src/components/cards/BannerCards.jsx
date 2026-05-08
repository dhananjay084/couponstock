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
