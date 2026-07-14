export const ALLOWED_COUNTRY_CODES = [];

export const getCountryCodeFromName = () => "";
export const getCountryNameFromCode = () => "";
export const getCountryCodeFromHostname = () => "";
export const getFixedCountryCode = () => "";
export const getConfiguredDefaultCountryCode = () => "";
export const isFixedCountryDomain = () => false;
export const isCountryCodeSegment = () => false;
export const isAllowedCountryCode = () => false;

export const splitCountryPrefix = (pathname = "/") => ({
  basePath: pathname || "/",
  countryCode: null,
});

export const addCountryPrefix = (pathname = "/") => pathname || "/";

export const findCountryNameByCode = () => null;
export const getCountryCodesFromValue = () => [];
export const doesCountrySelectionMatch = () => true;
