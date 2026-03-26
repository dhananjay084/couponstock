import { notFound } from "next/navigation";
import { isCountryCodeSegment } from "../../lib/countryPath";

export default function CountryLayout({ children, params }) {
  const code = params?.country;
  if (!isCountryCodeSegment(code)) {
    notFound();
  }
  return children;
}
