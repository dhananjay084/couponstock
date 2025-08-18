"use client";

import React from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import ContactAdmin from "@/components/dashboard/contact";

const DealsPage = () => {
  return (
    <ProtectedAdminRoute>
      <ContactAdmin />
    </ProtectedAdminRoute>
  );
};

export default DealsPage;
