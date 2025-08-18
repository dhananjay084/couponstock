"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import DealsAdmin from "@/components/dashboard/deals";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <DealsAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
