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

const GEOLOCATION_TIMEOUT_MS = 8000;

const reverseGeocodeCountry = async (latitude, longitude) => {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await response.json();
  return String(data?.countryName || data?.countryCode || "").trim();
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: GEOLOCATION_TIMEOUT_MS,
      maximumAge: 10 * 60 * 1000,
    });
  });

const resolveCountrySelection = (countries, detectedCountry) => {
  const detectedCode = getCountryCodeFromName(detectedCountry);
  if (detectedCode && isAllowedCountryCode(detectedCode)) {
    return (
      findCountryNameByCode(countries, detectedCode) ||
      detectedCountry
    );
  }

  return findCountryNameByCode(countries, "gl") || "Global";
};


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { basePath: layoutBasePath } = splitCountryPrefix(pathname);
  const hideLayout = layoutBasePath === "/login" || layoutBasePath === "/signup" || layoutBasePath === "/payment";
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const lastNormalizedUrlRef = useRef(null);
  const countryDetectionAttemptedRef = useRef(false);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mycouponstock.com").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}${pathname || "/"}`;
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = layoutBasePath === "/";
  const shouldUsePageShell = !hideLayout && !isAdminRoute && !isHomeRoute;

  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hideLayout) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/country")) return;
    if (countryDetectionAttemptedRef.current) return;

    let cancelled = false;
    const detectCountry = async () => {
      countryDetectionAttemptedRef.current = true;

      const selectFallback = () => {
        if (cancelled) return;
        dispatch(setSelectedCountry(resolveCountrySelection(countries, "Global")));
      };

      try {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
          selectFallback();
          return;
        }

        if (typeof navigator.permissions !== "undefined" && navigator.permissions?.query) {
          const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
          if (permissionStatus.state === "denied") {
            selectFallback();
            return;
          }
        }

        const position = await getCurrentPosition();
        if (cancelled) return;

        const detectedCountry = await reverseGeocodeCountry(
          position.coords.latitude,
          position.coords.longitude
        );

        if (cancelled) return;
        dispatch(setSelectedCountry(resolveCountrySelection(countries, detectedCountry)));
      } catch (err) {
        selectFallback();
      }
    };

    if (countries.length) detectCountry();

    return () => {
      cancelled = true;
    };
  }, [countries, dispatch, hideLayout, pathname]);

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
    if (typeof window === "undefined") return;
    if (!selectedCountry) return;
    if (hideLayout) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/country")) return;

    const query = searchParams.toString();
    const currentUrl = query ? `${pathname}?${query}` : pathname;
    const nextPath = addCountryPrefix(pathname, selectedCountry);
    const nextUrl = query ? `${nextPath}?${query}` : nextPath;
    if (nextUrl === currentUrl) return;
    if (lastNormalizedUrlRef.current === nextUrl) return;

    lastNormalizedUrlRef.current = nextUrl;
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
