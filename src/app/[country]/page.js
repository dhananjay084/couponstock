import HomePage from "../page";
import { getCountryCodeFromName } from "../../lib/countryPath";

const getServerBase = () => {
  const base =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    "http://localhost:5000";
  return String(base).replace(/\/$/, "");
};

const fetchHomeAdminEntries = async () => {
  const res = await fetch(`${getServerBase()}/api/admin`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

const pickEntryByCountryCode = (entries = [], code = "") => {
  const normalized = String(code || "").toLowerCase();
  if (!normalized) return entries[0] || null;
  const match = entries.find((entry) => {
    const entryCode = getCountryCodeFromName(entry?.country || "");
    return entryCode === normalized;
  });
  return match || entries[0] || null;
};

export async function generateMetadata({ params }) {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickEntryByCountryCode(entries, params?.country);
    const title = selected?.homeMetaTitle?.trim?.() || "My Couponstock";
    const description =
      selected?.homeMetaDescription?.trim?.() || "Coupons & Deals";

    return {
      title,
      description,
    };
  } catch (err) {
    return {
      title: "My Couponstock",
      description: "Coupons & Deals",
    };
  }
}

export default function CountryHomePage() {
  return <HomePage />;
}
