"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const DealCard = ({ data }) => {
  if (!data) return null;

  const { storeDescription, storeImage, storeName } = data;
  const storeHref = data?.slug ? `/store/${data.slug}` : "#";
  

  return (
    <div className="pro-card relative mx-4 flex min-w-[277px] max-w-[450px] items-center overflow-hidden">

      {storeName && (
        <div
          className="absolute right-2 top-2 z-10 rounded-full border border-[#CDBBFF] bg-[#5B3CC4] px-2.5 py-1 text-[10px] font-semibold text-white shadow"
        >
          {storeName}
        </div>
      )}

      <div className="flex h-[112px] w-[112px] flex-shrink-0 items-center justify-center bg-white p-2.5">
        <img
          src={storeImage || "/default-store.jpg"}
          alt="Store"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5">
        <p className="line-clamp-3 text-[11px] text-[#59637A]">
          {storeDescription || "No description available."}
        </p>

        <Link
          href={storeHref}
          prefetch
          className="pro-btn-soft mt-3 self-start"
          onClick={(e) => {
            if (!data?.slug) {
              e.preventDefault();
              toast.error("Store slug not found!");
            }
          }}
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default DealCard;
