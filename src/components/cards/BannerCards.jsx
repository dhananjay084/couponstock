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
  
    console.log("Final Redirect URL:", finalUrl);
    window.open(finalUrl, "_blank"); // open in new tab
  };
  

  return (
    <div
    className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-[400px] mx-auto cursor-pointer"
    onClick={handleRedirect}
  >
    {/* Image */}
    <img
      src={data.dealImage}
      alt="Product Image"
      className="w-full h-auto object-contain block"
    />
  
    {/* Button (on top of image, bottom-right) */}
    <div className="absolute bottom-4 right-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRedirect();
        }}
        className="bg-[#E5DBF9] text-[#592EA9] font-semibold px-6 py-2 rounded-full text-sm shadow-md hover:bg-[#d6c6f5] transition cursor-pointer"
      >
        Shop Now
      </button>
    </div>
  </div>
  
  );
};

export default ProductCard;
