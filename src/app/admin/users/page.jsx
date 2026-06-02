"use client";

import React from "react";
import ProtectedAdminRoute from "../../../components/ProtectedAdminRoute";
import UsersAdmin from "../../../components/dashboard/users";

const AdminUsersPage = () => {
  return (
    <ProtectedAdminRoute>
      <UsersAdmin />
    </ProtectedAdminRoute>
  );
};

export default AdminUsersPage;
