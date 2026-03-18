"use client";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
// import withSkeleton from "@/components/skeletons/WithSkeleton";


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const hideLayout = pathname === "/login" || pathname === "/signup" || pathname==='/payment';
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}${pathname || "/"}`;

  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (selectedCountry) return;
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("selectedCountry");
    if (stored) {
      dispatch(setSelectedCountry(stored));
      return;
    }

    let cancelled = false;
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = await res.json();
        const detected = data?.country_name || data?.country || "";
        if (!detected || cancelled) return;
        const match = countries.find(
          (c) => c?.country_name?.toLowerCase?.() === detected.toLowerCase()
        );
        if (match) {
          dispatch(setSelectedCountry(match.country_name));
        }
      } catch (err) {
        // Silent fail: fallback to manual selection
      }
    };

    if (countries.length) detectCountry();

    return () => {
      cancelled = true;
    };
  }, [countries, dispatch, selectedCountry]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedCountry) {
      window.localStorage.setItem("selectedCountry", selectedCountry);
    }
  }, [selectedCountry]);

  //  const WrappedChildren = withSkeleton(() => <>{children}</>);


  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      {!hideLayout && <NavBar />}
       {children}
      {!hideLayout && <Footer />}
    </>
  );
}
