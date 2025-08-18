"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import ReviewAdmin from "@/components/dashboard/review";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <ReviewAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
