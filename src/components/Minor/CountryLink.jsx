"use client";

import Link from "next/link";

export default function CountryLink({ href, ...props }) {
  return <Link href={href} {...props} />;
}
