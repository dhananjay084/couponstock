"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@mui/material";

const TextLink = ({ text, colorText, link, linkText, noSectionWrap = false }) => {
  return (
    <div className={`${noSectionWrap ? "" : "section-wrap section-block"} flex items-center justify-between gap-4`.trim()}>
      <span className="flex items-end gap-2">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 800,
            color: "#1B2436",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {text}
        </Typography>
        {colorText && (
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 800,
              color: "#5B3CC4",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {colorText}
          </Typography>
        )}
      </span>
      {link ? (
        <Link
          href={link}
          className="inline-flex items-center gap-1 rounded-full border border-[#DCCEFF] bg-[#F7F2FF] px-3 py-1.5 text-[11px] font-semibold text-[#5B3CC4] transition hover:border-[#C8B0FF] hover:bg-[#F0E6FF]"
        >
          {linkText}
          <span aria-hidden>→</span>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

TextLink.defaultProps = {
  text: "",
  colorText: "",
  link: "",
  linkText: "",
  noSectionWrap: false,
};

export default TextLink;
