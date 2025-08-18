"use client";

import React, { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginPageClient />
    </Suspense>
  );
}
