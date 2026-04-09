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
    className="pro-card relative h-full w-full cursor-pointer overflow-hidden"
    onClick={handleRedirect}
  >
    <img
      src={data.dealImage}
      alt="Product Image"
      className="block h-auto w-full object-cover"
    />
  </div>
  
  );
};

export default ProductCard;
