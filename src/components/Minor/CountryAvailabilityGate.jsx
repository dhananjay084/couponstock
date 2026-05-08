"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import CountryLink from "./CountryLink";
import {
  addCountryPrefix,
  doesCountrySelectionMatch,
  getCountryCodeFromName,
  splitCountryPrefix,
} from "../../lib/countryPath";

const titleizeCountry = (value = "") =>
  String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export default function CountryAvailabilityGate({
  children,
  availableCountries,
  itemLabel = "deal",
}) {
  const pathname = usePathname();
  const { selectedCountry } = useSelector((state) => state.country || {});

  const { activeCountryCode, isAvailable, allDealsHref, availableCountryText } = useMemo(() => {
    const selectedCode = getCountryCodeFromName(selectedCountry || "");
    const { countryCode: pathCountryCode } = splitCountryPrefix(pathname || "/");
    const activeCode = selectedCode || pathCountryCode || "";
    const countryList = Array.isArray(availableCountries)
      ? availableCountries
      : availableCountries
        ? [availableCountries]
        : [];

    return {
      activeCountryCode: activeCode,
      isAvailable: doesCountrySelectionMatch({
        selectedCountry: activeCode,
        availableCountries: countryList,
      }),
      allDealsHref: addCountryPrefix("/deal", activeCode || selectedCountry || ""),
      availableCountryText: countryList
        .map((country) => String(country || "").trim())
        .filter(Boolean)
        .map(titleizeCountry)
        .join(", "),
    };
  }, [availableCountries, pathname, selectedCountry]);

  if (isAvailable) return children;

  return (
    <div className="relative min-h-[60vh]">
      <div className="pointer-events-none select-none blur-[10px] opacity-35 saturate-50">
        {children}
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-[32px] border border-[#E4D8FF] bg-white/95 p-6 text-center shadow-[0_28px_70px_rgba(52,24,110,0.18)] backdrop-blur-md sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FFE9D6_0%,#FFF5EA_100%)] text-2xl">
            !
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-[#241052] sm:text-3xl">
            This {itemLabel} is not available for your selected country
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5B5370] sm:text-base">
            Please refer to another deal from the correct country listing.
          </p>
          {availableCountryText ? (
            <p className="mt-2 text-sm font-medium text-[#3A1D78]">
              Available in: {availableCountryText}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CountryLink
              href="/deal"
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#3A1D78_0%,#5D31BD_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(61,27,128,0.28)] transition hover:brightness-[1.04]"
            >
              View All Deals
            </CountryLink>
            <span className="rounded-full border border-[#DDD2FF] bg-[#F8F5FF] px-4 py-3 text-xs font-semibold text-[#5B5370]">
              URL: {allDealsHref}
            </span>
          </div>
          {activeCountryCode ? (
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#8A7FB1]">
              Active country: {activeCountryCode}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
