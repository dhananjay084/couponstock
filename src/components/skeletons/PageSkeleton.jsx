"use client";
import React from "react";
import "./Skeleton.css";

const PageSkeleton = () => {
  return (
    <div className="skeleton-page">
      <div className="skeleton-block" />
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
};

export default PageSkeleton;
