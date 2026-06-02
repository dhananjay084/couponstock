"use client";

import React from "react";
import ProtectedAdminRoute from "../../../components/ProtectedAdminRoute";
import SubscribersAdmin from "../../../components/dashboard/subscribers";

const AdminSubscribersPage = () => {
  return (
    <ProtectedAdminRoute>
      <SubscribersAdmin />
    </ProtectedAdminRoute>
  );
};

export default AdminSubscribersPage;
