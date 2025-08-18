"use client";

import React from "react";
import { Typography } from "@mui/material";

const HeadingText = ({ title = "", content = "", isHtml = false }) => {
  return (
    <div className="my-4 shadow-[0px_4px_6px_rgba(103,103,103,0.25)] max-w-[95%] p-4 mx-auto border-2 rounded-lg border-[#f1f1f1]">
      <Typography sx={{ fontWeight: 700, fontSize: "15px" }}>
        {title}
      </Typography>

      {isHtml ? (
        <Typography
          sx={{ fontSize: "13px" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Typography sx={{ fontSize: "13px" }}>{content}</Typography>
      )}
    </div>
  );
};

export default HeadingText;
