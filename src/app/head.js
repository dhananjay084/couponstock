import { getCountryCodeFromName } from "../lib/countryPath";

export const revalidate = 3600;

const getServerBase = () => {
  const base =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    "http://localhost:5000";
  return String(base).replace(/\/$/, "");
};

const fetchHomeAdminEntries = async () => {
  const res = await fetch(`${getServerBase()}/api/admin/seo`, {
    next: { revalidate },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

const pickDefaultEntry = (entries = []) => {
  const india = entries.find(
    (entry) => getCountryCodeFromName(entry?.country || "") === "in"
  );
  return india || entries[0] || null;
};

export default async function Head() {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickDefaultEntry(entries);
    const title = selected?.homeMetaTitle?.trim?.() || "My Couponstock";
    const description =
      selected?.homeMetaDescription?.trim?.() || "Coupons & Deals";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch (err) {
    return (
      <>
        <title>My Couponstock</title>
        <meta name="description" content="Coupons & Deals" />
      </>
    );
  }
}
