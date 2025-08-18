"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import CategoryAdmin from "@/components/dashboard/categories";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <CategoryAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
