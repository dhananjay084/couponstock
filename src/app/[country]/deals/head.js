import {
  fetchHomeAdminEntries,
  pickEntryByCountryCode,
} from "../../../lib/homeAdminSeo";

export default async function Head({ params }) {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickEntryByCountryCode(entries, params?.country);
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

