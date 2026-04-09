"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FaqImage from "../../assets/faq.png"; // fallback image

const FAQAccordion = ({ data, imageUrl }) => {
  if (!data) return null;

  const [expanded, setExpanded] = useState(false);

  const handleChange = (index) => (_, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const displayFaqs = Array.isArray(data) ? data.slice(0, 8) : [];
  const showTwoColumns = displayFaqs.length > 4;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="grid gap-5 sm:grid-cols-[0.95fr_1.35fr]">
        <div className="relative hidden h-[420px] w-full sm:block">
          <Image
            src={imageUrl || FaqImage}
            alt="FAQ"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>

        <div className={`grid gap-4 ${showTwoColumns ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {displayFaqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
              className={`h-full rounded-lg shadow-lg cursor-pointer ${
                expanded === index ? "border border-gray-300" : ""
              }`}
              sx={{
                "&.MuiPaper-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  border: expanded === index ? "1px solid #ccc" : "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  expanded === index ? (
                    <RemoveIcon className="text-[#592EA9]" />
                  ) : (
                    <AddIcon className="text-[#592EA9]" />
                  )
                }
                className={`min-h-[74px] px-5 py-3 ${
                  expanded === index ? "border-b border-gray-200" : ""
                }`}
              >
                <Typography
                  className={`font-semibold text-base leading-6 ${
                    expanded === index ? "text-[#592EA9]" : "text-gray-900"
                  }`}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>

              {faq.answer && (
                <AccordionDetails className="px-6 py-4 text-gray-600">
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              )}
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
