
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
import { clearAuthMessage, setAuthMessage } from "../../redux/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress"; // Or any other loading component

// This is the component that uses useSearchParams and should be wrapped
const LoginComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const oauthHandledRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle OAuth redirects safely
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
  if (error) {
    // toast.error(error);
    dispatch(clearAuthMessage());
  }
  if (message) {
    // toast.success(message);
    dispatch(clearAuthMessage());
  }
}, [error, message, dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleEmailLogin = async (values, { setSubmitting }) => {
    dispatch(loginUser(values));
    dispatch(checkCurrentUser());
    setSubmitting(false);
    router.replace("/");
    router.refresh?.();
  };
  
  

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  
  const handleGoHome = () => {
    router.push("/"); // navigate to homepage
  };

  return (
    <div className="min-h-[calc(100vh-0px)] flex flex-col lg:flex-row bg-white">
      {/* Left image section on desktop */}
      <div className="hidden lg:flex flex-1 bg-cover bg-center rounded-l-lg overflow-hidden">
        <div
          className="w-full"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Form container */}
      <div className="flex-1 px-6 py-10 lg:px-16 lg:py-16 flex flex-col justify-center">

         <div className="flex justify-between w-full max-w-md mb-6">
          <h1 className="text-[#592EA9] font-bold text-lg  cursor-pointer px-30"  onClick={handleGoHome}>MY COUPON STOCK</h1>
          {/* <a href="/help" className="text-[#592EA9] hover:underline text-sm">
            HELP
          </a> */}
        </div>


        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-center text-[#592EA9] mb-4">
            Welcome Back 
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

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 shadow-sm rounded-md py-3 hover:bg-gray-50 transition cursor-pointer"
              disabled={loading}
            >
              <GoogleIcon className="text-[#4285F4]" />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          <div className="text-center text-sm mt-6">
            You don’t have an account?{" "}
            <a className="text-[#592EA9] hover:underline cursor-pointer" href="/signup">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is the page component that wraps the LoginComponent
const LoginPageWrapper = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    }>
      <LoginComponent />
    </Suspense>
  );
};

export default LoginPageWrapper;