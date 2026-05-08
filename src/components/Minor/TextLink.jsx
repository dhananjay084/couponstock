"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@mui/material";

const TextLink = ({ text, colorText, link, linkText, noSectionWrap = false }) => {
  return (
    <div className={`${noSectionWrap ? "" : "section-wrap section-block"} coupon-section-header`.trim()}>
      <div className="min-w-0">
        <span className="coupon-heading-kicker mb-3">Featured savings</span>
        <span className="flex flex-wrap items-end gap-2">
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.2rem", md: "1.55rem" },
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
                fontSize: { xs: "1.2rem", md: "1.55rem" },
                fontWeight: 800,
                color: "#5b33d6",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {colorText}
            </Typography>
          )}
        </span>
      </div>
      {link ? (
        <Link
          href={link}
          className="inline-flex items-center gap-1 rounded-full border border-[#d8ccff] bg-[#f5efff] px-4 py-2 text-[12px] font-bold text-[#5b33d6] transition hover:border-[#c7b6ff] hover:bg-[#efe7ff]"
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
