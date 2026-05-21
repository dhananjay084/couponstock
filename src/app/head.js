import { fetchHomeAdminEntries, pickDefaultEntry } from "../lib/homeAdminSeo";

export const revalidate = 3600;

export default async function Head() {
  try {
    const entries = await fetchHomeAdminEntries();
    const selected = pickDefaultEntry(entries);
    const title = selected?.homeMetaTitle?.trim?.() || "My Couponstock";
    const description =
      selected?.homeMetaDescription?.trim?.() || "Coupons & Deals";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  } catch (err) {
    return (
      <>
        <title>My Couponstock</title>
        <meta name="description" content="Coupons & Deals" />
      </>
    );
  }
}
