"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  googleLogin,
  checkCurrentUser,
  setUserDataInCookies,
} from "../../redux/auth/authApi";
import { clearAuthMessage, setAuthMessage } from "../../redux/auth/authSlice";
import { useSearchParams, useRouter } from "next/navigation";
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
      window.history.replaceState({}, document.title, window.location.pathname);
      dispatch(checkCurrentUser());
      oauthHandledRef.current = true;
    } else if (authError === "google_auth_failed") {
      dispatch(
        setAuthMessage({
          message: "Google authentication failed. Please try again.",
          type: "error",
        })
      );
      window.history.replaceState({}, document.title, window.location.pathname);
      oauthHandledRef.current = true;
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (error || message) {
      dispatch(clearAuthMessage());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      onClose?.(); // close modal on success
    }
  }, [isAuthenticated, loading, onClose]);

  const handleEmailLogin = async (values, { setSubmitting }) => {
    await dispatch(loginUser(values));
    setSubmitting(false);
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-between py-6 px-4">
      {/* ❌ Close icon in top-right corner */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* ✅ Top Heading */}
      <div className="text-center mt-10">
        <h3 className="text-black text-[18px] font-semibold">
          1 step away from earning cashback
        </h3>
      </div>

      {/* ✅ Actual Modal (Form Area, unchanged) */}
      <div className="bg-white w-full max-w-md rounded-lg px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-[#592EA9] mb-4">
          Welcome Back 👋
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleEmailLogin}
        >
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-[#592EA9] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </a>
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

        {/* Divider */}
        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <div className="px-3 text-sm text-gray-500">Or login with</div>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Login */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 hover:bg-gray-50 transition cursor-pointer"
            disabled={loading}
          >
            <GoogleIcon className="text-[#4285F4]" />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>

        <div className="text-center text-sm mt-6">
          You don’t have an account?{" "}
          <a
            className="text-[#592EA9] hover:underline cursor-pointer"
            href="/signup"
          >
            Sign up
          </a>
        </div>
      </div>

      {/* ✅ "Continue & Lose Cashback" at the very bottom */}
      <div className="text-center mt-6 mb-4">
        <button
          onClick={onClose}
          className="text-[#0047FF] text-sm underline hover:text-[#0036cc]"
        >
          Continue & Lose Cashback
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
