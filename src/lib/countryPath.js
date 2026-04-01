const COUNTRY_CODE_REGEX = /^[a-z]{2}$/i;
export const ALLOWED_COUNTRY_CODES = ["in", "us", "uk", "es", "de", "fr", "pt", "gl"];
const NO_COUNTRY_PREFIX_PATHS = ["/about", "/contact", "/blogs", "/blog", "/privacy", "/terms"];
const COUNTRY_NAME_ALIASES = {
  "united states of america": "us",
  "united states": "us",
  "u.s.": "us",
  "u.s.a.": "us",
  "usa": "us",
  "united kingdom": "uk",
  "uk": "uk",
  "u.k.": "uk",
  "south korea": "kr",
  "north korea": "kp",
  "russia": "ru",
  "vietnam": "vn",
  "taiwan": "tw",
  "czech republic": "cz",
  "india": "in",
  "spain": "es",
  "germany": "de",
  "france": "fr",
  "portugal": "pt",
  "global": "gl",
};

let nameToCodeCache = null;

const buildNameToCodeCache = () => {
  if (nameToCodeCache) return nameToCodeCache;
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") {
    nameToCodeCache = new Map();
    return nameToCodeCache;
  }
  if (typeof Intl.supportedValuesOf !== "function") {
    nameToCodeCache = new Map();
    return nameToCodeCache;
  }

  const display = new Intl.DisplayNames(["en"], { type: "region" });
  const map = new Map();
  let regions = [];
  try {
    regions = Intl.supportedValuesOf("region");
  } catch (err) {
    nameToCodeCache = new Map();
    return nameToCodeCache;
  }
  regions.forEach((code) => {
    const name = display.of(code);
    if (name) {
      map.set(name.toLowerCase(), code.toLowerCase());
    }
  });
  nameToCodeCache = map;
  return nameToCodeCache;
};

export const getCountryCodeFromName = (countryName = "") => {
  const raw = String(countryName || "").trim();
  if (!raw) return "";

  const parenMatch = raw.match(/\(([a-z]{2})\)\s*$/i);
  if (parenMatch) return parenMatch[1].toLowerCase();

  if (COUNTRY_CODE_REGEX.test(raw)) return raw.toLowerCase();

  const normalized = raw.toLowerCase();
  if (COUNTRY_NAME_ALIASES[normalized]) return COUNTRY_NAME_ALIASES[normalized];

  const cache = buildNameToCodeCache();
  return cache.get(normalized) || "";
};

export const isCountryCodeSegment = (segment = "") =>
  COUNTRY_CODE_REGEX.test(segment || "");

export const isAllowedCountryCode = (code = "") =>
  ALLOWED_COUNTRY_CODES.includes(String(code || "").toLowerCase());

export const splitCountryPrefix = (pathname = "/") => {
  const cleanPath = (pathname || "/").split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length === 0) return { basePath: "/", countryCode: null };

  const first = segments[0];
  if (!isCountryCodeSegment(first)) {
    return { basePath: cleanPath || "/", countryCode: null };
  }

  const baseSegments = segments.slice(1);
  const basePath = `/${baseSegments.join("/")}` || "/";
  return { basePath: basePath === "" ? "/" : basePath, countryCode: first.toLowerCase() };
};

export const addCountryPrefix = (pathname = "/", countryName = "") => {
  const code = getCountryCodeFromName(countryName);
  if (!code) return pathname || "/";
  const { basePath, countryCode } = splitCountryPrefix(pathname);
  const cleanBase = basePath || "/";
  const isNoPrefixPath = NO_COUNTRY_PREFIX_PATHS.some(
    (route) => cleanBase === route || cleanBase.startsWith(`${route}/`)
  );
  if (isNoPrefixPath) return cleanBase || "/";
  if (code === "in") return cleanBase || "/";
  if (countryCode === code) return pathname || "/";
  const base = cleanBase === "/" ? "" : cleanBase;
  return `/${code}${base}` || `/${code}`;
};

export const findCountryNameByCode = (countries = [], code = "") => {
  if (!code) return null;
  const normalized = code.toLowerCase();
  const match = countries.find((c) => {
    const name = c?.country_name || "";
    return getCountryCodeFromName(name) === normalized;
  });
  return match?.country_name || null;
};
