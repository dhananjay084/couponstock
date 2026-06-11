const normalizeBase = (value) => String(value || "").trim().replace(/\/$/, "");

const getHostname = (value) => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
};

export const getServerApiBase = () => {
  return getServerApiBases()[0] || "http://127.0.0.1:5000";
};

export const getServerApiBases = (path = "") => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  const isBackendApiPath = normalizedPath.startsWith("/api/");
  const candidates = [
    process.env.INTERNAL_SERVER_URL,
    process.env.SERVER_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
    !isBackendApiPath ? process.env.NEXT_PUBLIC_SITE_URL : "",
    "http://127.0.0.1:5000",
  ]
    .map((value) => normalizeBase(value))
    .filter(Boolean);

  const ordered = [];

  const internalBase =
    process.env.INTERNAL_SERVER_URL ||
    process.env.SERVER_URL;

  if (internalBase) {
    ordered.push(normalizeBase(internalBase));
  }

  const publicApiBase = process.env.NEXT_PUBLIC_SERVER_URL;
  const publicSiteBase = process.env.NEXT_PUBLIC_SITE_URL;

  if (publicApiBase) {
    const apiHost = getHostname(publicApiBase);
    if (apiHost && apiHost !== "localhost" && apiHost !== "127.0.0.1") {
      ordered.push(normalizeBase(publicApiBase));
    }
  }

  if (publicSiteBase && !isBackendApiPath) {
    ordered.push(normalizeBase(publicSiteBase));
  }

  if (publicApiBase) {
    ordered.push(normalizeBase(publicApiBase));
  }

  candidates.forEach((value) => ordered.push(value));

  return [...new Set(ordered)];
};

export const buildServerApiUrl = (path = "") => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return `${getServerApiBases(normalizedPath)[0] || "http://127.0.0.1:5000"}${normalizedPath}`;
};

export const buildServerApiUrls = (path = "") => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return getServerApiBases(normalizedPath).map((base) => `${base}${normalizedPath}`);
};
