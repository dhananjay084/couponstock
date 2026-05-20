import { getCountryCodeFromName } from "./countryPath.js";
import { buildServerApiUrl, getServerApiBase } from "./serverApi.js";

export const HOME_ADMIN_REVALIDATE_SECONDS = 3600;

export const fetchHomeAdminEntries = async () => {
  const res = await fetch(buildServerApiUrl("/api/admin/seo"), {
    next: { revalidate: HOME_ADMIN_REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

export { getServerApiBase as getServerBase };

export const pickDefaultEntry = (entries = []) => {
  const india = entries.find(
    (entry) => getCountryCodeFromName(entry?.country || "") === "in"
  );
  return india || entries[0] || null;
};

export const pickEntryByCountryCode = (entries = [], code = "") => {
  const normalized = String(code || "").toLowerCase();
  if (!normalized) return entries[0] || null;
  const match = entries.find((entry) => {
    const entryCode = getCountryCodeFromName(entry?.country || "");
    return entryCode === normalized;
  });
  return match || entries[0] || null;
};
