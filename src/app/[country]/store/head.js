import {
  fetchHomeAdminEntries,
  pickEntryByCountryCode,
} from "../../../lib/homeAdminSeo";

export default async function Head({ params }) {
  try {
    const { country } = await params;
    const entries = await fetchHomeAdminEntries(country);
    const selected = pickEntryByCountryCode(entries, country);
    const title = selected?.storeMetaTitle?.trim?.() || "Stores | My Couponstock";
    const description =
      selected?.storeMetaDescription?.trim?.() ||
      "Browse all stores and brands to find the best offers.";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch {
    return (
      <>
        <title>Stores | My Couponstock</title>
        <meta
          name="description"
          content="Browse all stores and brands to find the best offers."
        />
      </>
    );
  }
}
