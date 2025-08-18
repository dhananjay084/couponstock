// src/app/signup/page.jsx
"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, googleLogin } from "../../redux/auth/authApi";
import { clearAuthMessage, setAuthMessage } from "../../redux/auth/authSlice";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const handleEmailSignup = async (values, { setSubmitting, resetForm }) => {
    dispatch(clearAuthMessage());

    if (values.password !== values.confirmPassword) {
      dispatch(
        setAuthMessage({ message: "Passwords do not match.", type: "error" })
      );
      setSubmitting(false);
      return;
    }

    const resultAction = await dispatch(registerUser(values));
    setSubmitting(false);

    if (registerUser.fulfilled.match(resultAction)) {
      resetForm();
      router.push("/login"); // redirect to login after signup
    }
  };

  const handleGoogleSignup = () => {
    dispatch(googleLogin());
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left image section */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1522336572468-97b06e8ef143?q=80&w=1470&auto=format&fit=crop"
          alt="Signup banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form section */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full px-6 sm:px-10 py-10">
        {/* Top Header */}
        <div className="flex justify-between w-full max-w-md mb-6">
          <h1 className="text-[#592EA9] font-bold text-lg">MY COUPON STOCK</h1>
          {/* <a href="/help" className="text-[#592EA9] hover:underline text-sm">
            HELP
          </a> */}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>

        {/* Messages */}
        {/* {message && (
          <div
            className={`p-3 mb-4 rounded text-sm ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 rounded text-sm bg-red-100 text-red-700">
            {error}
          </div>
        )} */}

        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          onSubmit={handleEmailSignup}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 w-full max-w-md">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Your name
                </label>
                <Field
                  name="name"
                  placeholder="Input your first name"
                  className="w-full border border-gray-300 p-3 mt-1 rounded-md focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Input email address"
                  className="w-full border border-gray-300 p-3 mt-1 rounded-md focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Input your password"
                  className="w-full border border-gray-300 p-3 mt-1 rounded-md focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Input confirm password"
                  className="w-full border border-gray-300 p-3 mt-1 rounded-md focus:ring-2 focus:ring-[#592EA9] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#592EA9] text-white p-3 rounded-md mt-4 hover:bg-opacity-90 transition-colors duration-200"
                disabled={isSubmitting || loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6 w-full max-w-md">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-500">
            Or sign up with
          </div>
        </div>

        {/* Google Button */}
        <div className="space-y-3 w-full max-w-md">
          <button
            onClick={handleGoogleSignup}
            className="w-full shadow-md p-3 rounded-md flex items-center justify-center gap-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            disabled={loading}
          >
            <GoogleIcon className="text-[#4285F4]" /> Continue with Google
          </button>
        </div>

        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a className="text-[#592EA9] hover:underline" href="/login">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
