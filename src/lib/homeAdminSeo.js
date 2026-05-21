import { getCountryCodeFromName } from "./countryPath.js";
import { buildServerApiUrl, getServerApiBase } from "./serverApi.js";

export const HOME_ADMIN_REVALIDATE_SECONDS = 3600;
const HOME_ADMIN_FETCH_TIMEOUT_MS = 3000;

const buildSeoUrl = (country = "") => {
  const normalizedCountry = String(country || "").trim().toLowerCase();
  const query = normalizedCountry
    ? `?country=${encodeURIComponent(normalizedCountry)}`
    : "";
  return buildServerApiUrl(`/api/admin/seo${query}`);
};

export const fetchHomeAdminEntries = async (country = "") => {
  try {
    const res = await fetch(buildSeoUrl(country), {
      next: { revalidate: HOME_ADMIN_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(HOME_ADMIN_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
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
