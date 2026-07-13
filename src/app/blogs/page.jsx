import BlogsClient from "./BlogsClient";
import { fetchBlogsListingPageData } from "../../lib/publicPageData";

export const metadata = {
  title: "Money Saving Blog | Coupons, Deals & Shopping Guides | MyCouponStock",
  description:
    "Discover expert shopping advice, coupon hacks, discount guides, and deal-finding strategies. Stay updated with the latest savings opportunities from MyCouponStock.",
};

export default async function Page() {
  const { blogs = [] } = await fetchBlogsListingPageData();
  return <BlogsClient blogs={blogs} />;
}
