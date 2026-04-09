"use client";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
import { addCountryPrefix, findCountryNameByCode, getCountryCodeFromName, isAllowedCountryCode, splitCountryPrefix } from "../lib/countryPath";
import NewsLetter from "../components/Minor/NewsLetter";
// import withSkeleton from "@/components/skeletons/WithSkeleton";


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { basePath: layoutBasePath } = splitCountryPrefix(pathname);
  const hideLayout = layoutBasePath === "/login" || layoutBasePath === "/signup" || layoutBasePath === "/payment";
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const hasNormalizedRootPath = useRef(false);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}${pathname || "/"}`;
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = layoutBasePath === "/";
  const shouldUsePageShell = !hideLayout && !isAdminRoute && !isHomeRoute;

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
  }, [countries, dispatch, selectedCountry]);

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
    if (hasNormalizedRootPath.current) return;

    // Avoid double-hop navigation on every click.
    // Only normalize the bare root path once so internal routing remains fast.
    const { countryCode } = splitCountryPrefix(pathname);
    if (countryCode) return;
    if (pathname !== "/") return;

    const nextPath = addCountryPrefix(pathname, selectedCountry);
    if (nextPath === pathname) return;
    const query = searchParams.toString();
    const nextUrl = query ? `${nextPath}?${query}` : nextPath;
    hasNormalizedRootPath.current = true;
    router.replace(nextUrl);
  }, [hideLayout, pathname, router, searchParams, selectedCountry]);

  //  const WrappedChildren = withSkeleton(() => <>{children}</>);


  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      {showNewsletterPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E4D8FF] bg-white p-4 shadow-xl">
            <button
              onClick={() => setShowNewsletterPopup(false)}
              className="absolute right-3 top-2 cursor-pointer text-lg font-bold text-[#592EA9]"
              aria-label="Close newsletter popup"
            >
              ×
            </button>
            <NewsLetter />
          </div>
        </div>
      )}
      {!hideLayout && <NavBar />}
      {!isAdminRoute && (
        <button
          type="button"
          aria-label="Open newsletter popup"
          onClick={() => setShowNewsletterPopup(true)}
          className="fixed bottom-6 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-[#592EA9] text-white shadow-[0_14px_30px_rgba(89,46,169,0.36)] transition hover:bg-[#4B2295]"
        >
          ✉
        </button>
      )}
      {shouldUsePageShell ? <div className="site-shell site-gutter py-3">{children}</div> : children}
      {!hideLayout && <Footer />}
    </>
  );
}
