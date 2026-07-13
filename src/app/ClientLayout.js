"use client";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
import {
  findCountryNameByCode,
  getConfiguredDefaultCountryCode,
  getCountryNameFromCode,
  isAllowedCountryCode,
  splitCountryPrefix,
} from "../lib/countryPath";
import NewsLetter from "../components/Minor/NewsLetter";
// import withSkeleton from "@/components/skeletons/WithSkeleton";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { basePath: layoutBasePath } = splitCountryPrefix(pathname);
  const hideLayout = layoutBasePath === "/login" || layoutBasePath === "/signup" || layoutBasePath === "/payment";
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  const defaultCountryName = getCountryNameFromCode(defaultCountryCode);
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = layoutBasePath === "/";
  const shouldUsePageShell = !hideLayout && !isAdminRoute && !isHomeRoute;

  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  useEffect(() => {
    if (!countries.length) return;
    if (hideLayout) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/country")) return;
    const { countryCode } = splitCountryPrefix(pathname);
    const defaultCountry = findCountryNameByCode(countries, defaultCountryCode) || defaultCountryName;

    if (!countryCode) {
      if (defaultCountry && defaultCountry !== selectedCountry) {
        dispatch(setSelectedCountry(defaultCountry));
      }
      return;
    }

    if (!isAllowedCountryCode(countryCode)) {
      if (defaultCountry && defaultCountry !== selectedCountry) {
        dispatch(setSelectedCountry(defaultCountry));
      }
      return;
    }

    const match = findCountryNameByCode(countries, countryCode);
    if (match && match !== selectedCountry) {
      dispatch(setSelectedCountry(match));
    } else if (!match && defaultCountry && defaultCountry !== selectedCountry) {
      dispatch(setSelectedCountry(defaultCountry));
    }
  }, [countries, defaultCountryCode, defaultCountryName, dispatch, hideLayout, pathname, selectedCountry]);

  //  const WrappedChildren = withSkeleton(() => <>{children}</>);


  return (
    <>
        {showNewsletterPopup && (
        <div className="fixed inset-0 z-[10020] flex items-center justify-center bg-black/45 px-4">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setShowNewsletterPopup(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C4FF] bg-white text-xl font-bold leading-none text-[#592EA9] shadow-[0_10px_24px_rgba(89,46,169,0.18)] transition hover:scale-[1.04] hover:bg-[#F8F3FF]"
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
          className="fixed z-[85] flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(135deg,#592EA9_0%,#6E3EDC_100%)] text-white shadow-[0_18px_40px_rgba(89,46,169,0.42)] transition hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98]"
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
