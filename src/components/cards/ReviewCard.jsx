"use client";

import React from "react";
import Image from "next/image";

const ReviewCard = ({ data }) => {
  const { name, designation, desc, image } = data || {};

  return (
    <div className="shadow-2xl border border-[#f1f1f1] p-4 min-w-[350px] max-w-[350px] space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-[12px]">{name || "Anonymous"}</p>
          <p className="text-[7px]">{designation || "Designation"}</p>
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
        <p className="text-[10px]">{desc || "No review available."}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
