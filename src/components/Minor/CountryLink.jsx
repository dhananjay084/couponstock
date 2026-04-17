"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { addCountryPrefix } from "../../lib/countryPath";

export default function CountryLink({ href, ...props }) {
  const { selectedCountry } = useSelector((state) => state.country || {});

  const resolvedHref = useMemo(() => {
    if (typeof href !== "string") return href;
    return addCountryPrefix(href, selectedCountry || "");
  }, [href, selectedCountry]);

  return <Link href={resolvedHref} {...props} />;
}

