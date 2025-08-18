"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@mui/material";

const TextLink = ({ text, colorText, link, linkText }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <span className="flex items-center gap-1">
        {text}
        {colorText && <Typography color="#592ea9">{colorText}</Typography>}
      </span>
      {link ? (
        <Link href={link} className="decoration-solid text-[#592EA9] underline text-[10px]">
          {linkText}
        </Link>
      ) : (
       ''
      )}
    </div>
  );
};

TextLink.defaultProps = {
  text: "",
  colorText: "",
  link: "",
  linkText: "",
};

export default TextLink;
