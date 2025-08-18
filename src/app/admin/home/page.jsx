"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import HomeAdmin from "@/components/dashboard/home";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <HomeAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
