"use client";

import React from "react";

const Banner = ({ Text, ColorText, BgImage,link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div
        className="pro-card relative mx-auto mt-4 flex min-h-[205px] w-[95%] items-center justify-center rounded-2xl bg-cover bg-center p-4 sm:p-6 md:p-8"
        style={{
          backgroundImage: `url(${BgImage?.src || BgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(13,18,33,0.6),rgba(13,18,33,0.2),transparent)]" />
        <div className="relative w-full text-white">
          <p className="max-w-full text-sm font-semibold leading-snug sm:max-w-[90%] sm:text-base md:max-w-[70%] md:text-xl lg:max-w-[60%] lg:text-2xl">
            {Text}
            {ColorText && (
              <span className="ml-2 inline-block rounded-lg bg-[#5B3CC4] px-2 py-1 text-white">
                {ColorText}
              </span>
            )}
          </p>
        </div>
      </div>
    </a>
  );
};

Banner.defaultProps = {
  Text: "",
  ColorText: "",
  BgImage: "",
};

export default Banner;
