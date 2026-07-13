export const htmlToPlainText = (html = "") => {
  if (!html) return "";

  const source = String(html);

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(source, "text/html");
    doc.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    return (doc.body?.textContent || doc.documentElement?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
