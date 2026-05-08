"use client";

import React from "react";
import Image from "next/image";

const ReviewCard = ({ data }) => {
  const { name, designation, desc, image } = data || {};

  return (
    <div className="coupon-spotlight-card min-h-[220px] min-w-[320px] max-w-[360px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex text-[#f59e0b]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx}>★</span>
            ))}
          </div>
          <p className="text-[14px] font-bold text-[#172338]">{name || "Anonymous"}</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#7b879b]">{designation || "Customer"}</p>
        </div>
        <div className="relative h-[54px] w-[54px] overflow-hidden rounded-full border-2 border-white shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
          <Image
            src={image || "/default-user.jpg"}
            alt={name || "User"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="flex-1">
        <p className="line-clamp-6 text-[13px] leading-6 text-[#56657f]">{desc || "No review available."}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
