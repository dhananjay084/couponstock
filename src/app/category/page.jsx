// src/app/category/page.jsx
import React, { Suspense } from "react";
import SingleCategoryClient from "./SingleCategoryClient";

export default function CategoryPage() {
  return (
    <Suspense fallback={<p className="text-center p-4">Loading category...</p>}>
      <SingleCategoryClient />
    </Suspense>
  );
}
