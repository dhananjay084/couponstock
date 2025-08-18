"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import BlogsAdmin from "@/components/dashboard/blogs";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <BlogsAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
