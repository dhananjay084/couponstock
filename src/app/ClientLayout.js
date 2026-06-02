"use client";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
import { findCountryNameByCode, getCountryCodeFromName, isAllowedCountryCode, splitCountryPrefix } from "../lib/countryPath";
import NewsLetter from "../components/Minor/NewsLetter";
// import withSkeleton from "@/components/skeletons/WithSkeleton";

const COUNTRY_STORAGE_KEY = "mcs:selected-country";
const COUNTRY_INIT_STATUS_KEY = "mcs:country-init-status";

export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { basePath: layoutBasePath } = splitCountryPrefix(pathname);
  const hideLayout = layoutBasePath === "/login" || layoutBasePath === "/signup" || layoutBasePath === "/payment";
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}${pathname || "/"}`;
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = layoutBasePath === "/";
  const shouldUsePageShell = !hideLayout && !isAdminRoute && !isHomeRoute;

  const setGlobalCountry = () => {
    const globalCountry = findCountryNameByCode(countries, "gl") || "Global";
    if (globalCountry && selectedCountry !== globalCountry) {
      dispatch(setSelectedCountry(globalCountry));
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COUNTRY_STORAGE_KEY, globalCountry);
      window.localStorage.setItem(COUNTRY_INIT_STATUS_KEY, "global");
    }
  };

  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (!countries.length) return;
    if (hideLayout) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/country")) return;
    const { countryCode } = splitCountryPrefix(pathname);
    if (countryCode) return;
    if (selectedCountry) return;
    if (typeof window === "undefined") return;

    const persistedCountry = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (persistedCountry) {
      const matchedPersistedCountry = countries.find(
        (country) => String(country?.country_name || "").trim() === persistedCountry
      )?.country_name;
      if (matchedPersistedCountry) {
        dispatch(setSelectedCountry(matchedPersistedCountry));
        return;
      }
    }

    const initStatus = window.localStorage.getItem(COUNTRY_INIT_STATUS_KEY);
    if (initStatus === "denied" || initStatus === "global") {
      setGlobalCountry();
      return;
    }

    if (!navigator.geolocation) {
      setGlobalCountry();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
          url.searchParams.set("latitude", String(latitude));
          url.searchParams.set("longitude", String(longitude));
          url.searchParams.set("localityLanguage", "en");

          const response = await fetch(url.toString());
          const data = await response.json().catch(() => ({}));
          const detectedCode = String(
            data?.countryCode || getCountryCodeFromName(data?.countryName || "")
          ).toLowerCase();

          if (!detectedCode || !isAllowedCountryCode(detectedCode)) {
            setGlobalCountry();
            return;
          }

          const matchedCountry = findCountryNameByCode(countries, detectedCode);
          if (!matchedCountry) {
            setGlobalCountry();
            return;
          }

          dispatch(setSelectedCountry(matchedCountry));
          window.localStorage.setItem(COUNTRY_STORAGE_KEY, matchedCountry);
          window.localStorage.setItem(COUNTRY_INIT_STATUS_KEY, "resolved");
        } catch (_error) {
          setGlobalCountry();
        }
      },
      () => {
        window.localStorage.setItem(COUNTRY_INIT_STATUS_KEY, "denied");
        setGlobalCountry();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 24 * 60 * 60 * 1000,
      }
    );
  }, [countries, dispatch, hideLayout, pathname, selectedCountry]);

  useEffect(() => {
    if (!countries.length) return;
    if (typeof window === "undefined") return;
    const { countryCode } = splitCountryPrefix(pathname);
    if (!countryCode) return;
    if (!isAllowedCountryCode(countryCode)) {
      const fallback = findCountryNameByCode(countries, "gl") || "Global";
      if (fallback && fallback !== selectedCountry) {
        dispatch(setSelectedCountry(fallback));
      }
      return;
    }
    const selectedCode = selectedCountry ? getCountryCodeFromName(selectedCountry) : "";
    if (
      selectedCode &&
      isAllowedCountryCode(selectedCode) &&
      selectedCode !== countryCode
    ) {
      return;
    }
    const match = findCountryNameByCode(countries, countryCode);
    if (match && match !== selectedCountry) {
      dispatch(setSelectedCountry(match));
    }
  }, [countries, dispatch, pathname, selectedCountry]);

  useEffect(() => {
    if (!selectedCountry) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, selectedCountry);
  }, [selectedCountry]);

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
      {!hideLayout && !isAdminRoute && (
        <button
          type="button"
          aria-label="Open newsletter signup"
          onClick={() => setShowNewsletterPopup(true)}
          title="Newsletter"
          style={{
            bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            right: "calc(1.25rem + env(safe-area-inset-right))",
          }}
          className="fixed z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(135deg,#592EA9_0%,#6E3EDC_100%)] text-white shadow-[0_18px_40px_rgba(89,46,169,0.42)] transition hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </button>
      )}
      {shouldUsePageShell ? <div className="site-shell site-gutter py-3">{children}</div> : children}
      {!hideLayout && <Footer />}
    </>
  );
}
