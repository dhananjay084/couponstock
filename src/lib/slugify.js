export const slugify = (value = "") =>
  value
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

export const slugWithId = (title, id) => {
  const base = slugify(title || "item");
  return id ? `${base}--${id}` : base;
};

export const extractIdFromSlug = (slug = "") => {
  const parts = slug.split("--");
  const maybeId = parts[parts.length - 1];
  return /^[0-9a-fA-F]{24}$/.test(maybeId) ? maybeId : null;
};

export const titleize = (slug = "") =>
  slug
    .toString()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
