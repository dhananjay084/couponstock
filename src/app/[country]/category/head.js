import {
  fetchHomeAdminEntries,
  pickEntryByCountryCode,
} from "../../../lib/homeAdminSeo";

export default async function Head({ params }) {
  const { country } = await params;

  try {
    const entries = await fetchHomeAdminEntries(country);
    const selected = pickEntryByCountryCode(entries, country);
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
