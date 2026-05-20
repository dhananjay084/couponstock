const normalizeBase = (value) => String(value || "").trim().replace(/\/$/, "");

const getHostname = (value) => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
};

export const getServerApiBase = () => {
  const internalBase =
    process.env.INTERNAL_SERVER_URL ||
    process.env.SERVER_URL;

  if (internalBase) {
    return normalizeBase(internalBase);
  }

  const publicApiBase = process.env.NEXT_PUBLIC_SERVER_URL;
  const publicSiteBase = process.env.NEXT_PUBLIC_SITE_URL;

  if (publicApiBase) {
    const apiHost = getHostname(publicApiBase);
    const siteHost = getHostname(publicSiteBase);

    // If the "API" URL points at the public site domain, server-side fetches can
    // receive a Next.js RSC payload instead of JSON on self-hosted deployments.
    if (!siteHost || apiHost !== siteHost) {
      return normalizeBase(publicApiBase);
    }
  }

  return "http://127.0.0.1:5000";
};

export const buildServerApiUrl = (path = "") => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return `${getServerApiBase()}${normalizedPath}`;
};
