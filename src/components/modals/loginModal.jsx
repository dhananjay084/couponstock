"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  googleLogin,
  checkCurrentUser,
  setUserDataInCookies,
} from "../../redux/auth/authApi";
import { setAuthMessage } from "../../redux/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const oauthHandledRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (oauthHandledRef.current) return;

    const name = searchParams?.get("name");
    const email = searchParams?.get("email");
    const authError = searchParams?.get("error");

    if (name && email) {
      setUserDataInCookies({
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
      });
      dispatch(
        setAuthMessage({
          message: `Welcome, ${decodeURIComponent(name)}! Logging you in...`,
          type: "success",
        })
      );
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      dispatch(checkCurrentUser());
      oauthHandledRef.current = true;
    } else if (authError === "google_auth_failed") {
      dispatch(
        setAuthMessage({
          message: "Google authentication failed. Please try again.",
          type: "error",
        })
      );
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      oauthHandledRef.current = true;
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      onClose();
      router.replace("/");
    }
  }, [isAuthenticated, loading, router, onClose]);

  const handleEmailLogin = async (values, { setSubmitting }) => {
    await dispatch(loginUser(values));
    setSubmitting(false);
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-[#592EA9] mb-6">
          Login
        </h2>

        <Formik initialValues={{ email: "", password: "" }} onSubmit={handleEmailLogin}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Example@email.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div /> {/* placeholder */}
                <div>
                  <a
                    href="/forgot-password"
                    className="text-sm text-[#592EA9] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#592EA9] text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition cursor-pointer"
                disabled={isSubmitting || loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <div className="px-3 text-sm text-gray-500">Or login with</div>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 shadow-sm rounded-md py-3 hover:bg-gray-50 transition cursor-pointer"
          disabled={loading}
        >
          <GoogleIcon className="text-[#4285F4]" />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};
 export default LoginModal