"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({ onCredential, onError, text = "continue_with" }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
        Google login is unavailable. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the frontend `.env`.
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onCredential}
        onError={() => onError?.(new Error("Google login failed."))}
        text={text}
        theme="outline"
        size="large"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}
