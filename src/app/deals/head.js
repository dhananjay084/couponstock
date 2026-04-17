import { fetchHomeAdminEntries, pickDefaultEntry } from "../../lib/homeAdminSeo";

export default async function Head() {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickDefaultEntry(entries);
    const title = selected?.dealsMetaTitle?.trim?.() || "Deals | My Couponstock";
    const description =
      selected?.dealsMetaDescription?.trim?.() ||
      "Browse the latest coupons and deals.";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch {
    return (
      <>
        <title>Deals | My Couponstock</title>
        <meta name="description" content="Browse the latest coupons and deals." />
      </>
    );
  }
}

