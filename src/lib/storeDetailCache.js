const STORAGE_KEY = "store-detail-navigation-cache";

export const cacheStoreDetailPayload = (payload) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload || {}));
  } catch (error) {
    console.warn("Unable to cache store detail payload", error);
  }
};

export const getCachedStoreDetailPayload = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Unable to read cached store detail payload", error);
    return null;
  }
};
