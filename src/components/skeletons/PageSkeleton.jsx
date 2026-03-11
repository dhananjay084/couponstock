"use client";

import React from "react";

const PageSkeleton = ({ sections = 3, cardsPerSection = 4 }) => {
  return (
    <div className="animate-pulse p-4 space-y-6">
      <div className="h-10 w-2/3 rounded-md bg-gray-200" />
      <div className="h-40 w-full rounded-xl bg-gray-200" />

      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <div className="space-y-4" key={`section-${sectionIndex}`}>
          <div className="h-6 w-48 rounded-md bg-gray-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: cardsPerSection }).map((_, cardIndex) => (
              <div
                key={`section-${sectionIndex}-card-${cardIndex}`}
                className="h-36 rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageSkeleton;
