// src/app/Providers.jsx
"use client"; // Required because Redux Provider uses hooks internally

import { useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { createAppStore } from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore({
      country: {
        countries: [],
        selectedCountry: null,
        loading: false,
        error: null,
      },
    });
  }
  const content = (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );

  return (
    <Provider store={storeRef.current}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {content}
        </GoogleOAuthProvider>
      ) : (
        content
      )}
    </Provider>
  );
}
