export async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.warn(`Expected JSON but received "${contentType}" from ${url}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch JSON from ${url}`, error);
    return null;
  }
}
