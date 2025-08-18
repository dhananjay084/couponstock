"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import StoreAdmin from "@/components/dashboard/store";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <StoreAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
