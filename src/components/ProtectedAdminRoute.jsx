"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkCurrentUser } from "@/redux/auth/authApi";

const ProtectedAdminRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthenticated, loading, user, error } = useSelector(
    (state) => state.auth
  );

  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(checkCurrentUser()).finally(() => {
        setIsInitialCheckComplete(true);
      });
    } else if (isAuthenticated || error) {
      setIsInitialCheckComplete(true);
    }
  }, [isAuthenticated, loading, error, dispatch]);

  if (loading || !isInitialCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#592EA9]">Loading...</h2>
          <p className="mt-4 text-gray-600">Verifying admin access.</p>
        </div>
      </div>
    );
  }

  const isAdmin = isAuthenticated && user?.role === "admin";

  if (!isAdmin) {
    router.replace("/"); // redirect to homepage
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
