"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import PageSkeleton from "@/components/skeletons/PageSkeleton";


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideLayout && <NavBar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
