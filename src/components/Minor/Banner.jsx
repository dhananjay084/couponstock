"use client";

import React,{useState} from "react";

const Banner = ({ Text, ColorText, BgImage }) => {
  return (
    <div
      className="relative flex items-center justify-center w-[95%] mx-auto bg-cover bg-center p-4 sm:p-6 md:p-8 mt-4 rounded-lg min-h-[205px]"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay (optional if needed for darker background) */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div> */}
      <div className="relative text-white w-full">
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-medium max-w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] leading-snug">
          {Text}
          {ColorText && (
            <span className="ml-2 bg-[#592EA9] px-2 py-1 rounded-lg text-white inline-block">
              {ColorText}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

Banner.defaultProps = {
  Text: "",
  ColorText: "",
  BgImage: "",
};

export default Banner;
