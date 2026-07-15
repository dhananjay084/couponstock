const DEFAULT_CACHE_TTL_MS = 30_000;
const fetchCache = globalThis.__couponstockFetchCache || new Map();

if (!globalThis.__couponstockFetchCache) {
  globalThis.__couponstockFetchCache = fetchCache;
}

const getCacheKey = (url, options) => {
  const method = String(options?.method || "GET").toUpperCase();
  const next = options?.next ? JSON.stringify(options.next) : "";
  const headers = options?.headers ? JSON.stringify(options.headers) : "";
  return `${method}::${url}::${next}::${headers}`;
};

export async function fetchJson(url, options = {}) {
  try {
    const { timeoutMs, signal, ...fetchOptions } = options || {};
    const resolvedSignal =
      signal || (timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined);

    const method = String(fetchOptions.method || "GET").toUpperCase();
    const cacheMode = String(fetchOptions.cache || "").toLowerCase();
    const shouldCache =
      method === "GET" &&
      cacheMode !== "no-store" &&
      cacheMode !== "reload";
    const cacheKey = shouldCache ? getCacheKey(url, fetchOptions) : null;
    const cached = cacheKey ? fetchCache.get(cacheKey) : null;
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const res = await fetch(url, { ...fetchOptions, signal: resolvedSignal });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.warn(`Expected JSON but received "${contentType}" from ${url}`);
      return null;
    }

    const data = await res.json();
    if (cacheKey) {
      const ttlMs =
        typeof fetchOptions.next?.revalidate === "number"
          ? fetchOptions.next.revalidate * 1000
          : DEFAULT_CACHE_TTL_MS;
      fetchCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + Math.max(ttlMs, 1000),
      });
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch JSON from ${url}`, error);
    return null;
  }
}
