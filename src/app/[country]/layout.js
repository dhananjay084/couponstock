import { notFound } from "next/navigation";
import { isCountryCodeSegment } from "../../lib/countryPath";

export default async function CountryLayout({ children, params }) {
  const { country: code } = await params;
  if (!isCountryCodeSegment(code)) {
    notFound();
  }
  return children;
}
