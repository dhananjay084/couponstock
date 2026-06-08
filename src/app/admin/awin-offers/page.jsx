"use client";

import React from "react";
import ProtectedAdminRoute from "../../../components/ProtectedAdminRoute";
import AwinOffersAdmin from "../../../components/dashboard/awinOffers";

const AdminAwinOffersPage = () => {
  return (
    <ProtectedAdminRoute>
      <AwinOffersAdmin />
    </ProtectedAdminRoute>
  );
};

export default AdminAwinOffersPage;
