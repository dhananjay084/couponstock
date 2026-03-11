"use client";

import React from "react";

export const TextSkeleton = ({ className = "h-4 w-40" }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export const RowSkeleton = ({ count = 4, itemClassName = "h-36 w-64 rounded-lg bg-gray-200" }) => (
  <div className="flex gap-4 overflow-x-auto px-4 py-2 animate-pulse">
    {Array.from({ length: count }).map((_, index) => (
      <div key={`row-skeleton-${index}`} className={itemClassName} />
    ))}
  </div>
);

export const GridSkeleton = ({
  count = 6,
  className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4",
  itemClassName = "h-36 rounded-lg bg-gray-200",
}) => (
  <div className={`${className} animate-pulse`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={`grid-skeleton-${index}`} className={itemClassName} />
    ))}
  </div>
);
