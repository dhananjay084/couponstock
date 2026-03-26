"use client";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
import { addCountryPrefix, findCountryNameByCode, getCountryCodeFromName, isAllowedCountryCode, splitCountryPrefix } from "../lib/countryPath";
// import withSkeleton from "@/components/skeletons/WithSkeleton";


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { basePath: layoutBasePath } = splitCountryPrefix(pathname);
  const hideLayout = layoutBasePath === "/login" || layoutBasePath === "/signup" || layoutBasePath === "/payment";
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}${pathname || "/"}`;

  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (selectedCountry) return;
    if (typeof window === "undefined") return;
    const { countryCode } = splitCountryPrefix(window.location.pathname);
    if (countryCode) return;

    const stored = window.localStorage.getItem("selectedCountry");
    if (stored) {
      const storedCode = getCountryCodeFromName(stored);
      if (isAllowedCountryCode(storedCode)) {
        dispatch(setSelectedCountry(stored));
        return;
      }
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
          const matchCode = getCountryCodeFromName(match.country_name);
          if (isAllowedCountryCode(matchCode)) {
            dispatch(setSelectedCountry(match.country_name));
            return;
          }
        }
        const fallback = findCountryNameByCode(countries, "us");
        if (fallback) {
          dispatch(setSelectedCountry(fallback));
        }
      } catch (err) {
        // Silent fail: fallback to manual selection
        const fallback = findCountryNameByCode(countries, "us");
        if (fallback) {
          dispatch(setSelectedCountry(fallback));
        }
      }
    };

    if (countries.length) detectCountry();

    return () => {
      cancelled = true;
    };
  }, [countries, dispatch, pathname, selectedCountry]);

  useEffect(() => {
    if (!countries.length) return;
    if (typeof window === "undefined") return;
    const { countryCode } = splitCountryPrefix(window.location.pathname);
    if (!countryCode) return;
    if (!isAllowedCountryCode(countryCode)) {
      const fallback = findCountryNameByCode(countries, "us");
      if (fallback && fallback !== selectedCountry) {
        dispatch(setSelectedCountry(fallback));
      }
      return;
    }
    const selectedCode = selectedCountry ? getCountryCodeFromName(selectedCountry) : "";
    if (selectedCode) return;
    const match = findCountryNameByCode(countries, countryCode);
    if (match && match !== selectedCountry) {
      dispatch(setSelectedCountry(match));
    }
  }, [countries, dispatch, pathname, selectedCountry]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedCountry) {
      window.localStorage.setItem("selectedCountry", selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedCountry) return;
    if (hideLayout) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/country")) return;

    const nextPath = addCountryPrefix(pathname, selectedCountry);
    if (nextPath === pathname) return;
    const query = searchParams.toString();
    const nextUrl = query ? `${nextPath}?${query}` : nextPath;
    router.replace(nextUrl);
  }, [hideLayout, pathname, router, searchParams, selectedCountry]);

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
