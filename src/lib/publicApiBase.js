const normalizeBase = (value) => String(value || "").trim().replace(/\/$/, "");

const getHostname = (value) => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
};

const isLoopbackHost = (hostname = "") =>
  hostname === "localhost" || hostname === "127.0.0.1";

export const getPublicApiBase = () => {
  const configuredBase = normalizeBase(process.env.NEXT_PUBLIC_SERVER_URL);

  if (typeof window !== "undefined") {
    const browserBase = normalizeBase(window.location.origin);
    const browserHost = getHostname(browserBase);
    const configuredHost = getHostname(configuredBase);

    // Production browsers should not try to call a localhost API baked into the build.
    if (!configuredBase || (isLoopbackHost(configuredHost) && !isLoopbackHost(browserHost))) {
      return browserBase;
    }
  }

  return configuredBase;
};

export const buildPublicApiUrl = (path = "") => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  const base = getPublicApiBase();
  return base ? `${base}${normalizedPath}` : normalizedPath;
};
