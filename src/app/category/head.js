import { fetchHomeAdminEntries, pickDefaultEntry } from "../../lib/homeAdminSeo";

export default async function Head() {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickDefaultEntry(entries);
    const title =
      selected?.categoryMetaTitle?.trim?.() || "Categories | My Couponstock";
    const description =
      selected?.categoryMetaDescription?.trim?.() ||
      "Browse coupon and deal categories to discover offers faster.";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch {
    return (
      <>
        <title>Categories | My Couponstock</title>
        <meta
          name="description"
          content="Browse coupon and deal categories to discover offers faster."
        />
      </>
    );
  }
}

