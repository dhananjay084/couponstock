"use client";

import React from "react";
import Image from "next/image";

const ReviewCard = ({ data }) => {
  const { name, designation, desc, image } = data || {};

  return (
    <div className="pro-card min-w-[320px] max-w-[350px] space-y-3 p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[13px] font-semibold text-[#1A243B]">{name || "Anonymous"}</p>
          <p className="text-[10px] text-[#67718A]">{designation || "Designation"}</p>
        </div>
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={image || "/default-user.jpg"}
            alt={name || "User"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div>
        <p className="text-[12px] leading-5 text-[#4F5A74]">{desc || "No review available."}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
