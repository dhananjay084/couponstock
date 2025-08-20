"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from "@/components/Minor/Banner";
import TextLink from "@/components/Minor/TextLink";
import Coupons_Deals from "@/components/cards/Coupons_Deals";
import ReviewCard from "@/components/cards/ReviewCard";
import HeadingText from "@/components/Minor/HeadingText";
import { getDeals } from "@/redux/deal/dealSlice";
import { fetchReviews } from "@/redux/review/reviewSlice";
import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";
// import { toast } from "react-toastify";

const AllCoupons = () => {
  const dispatch = useDispatch();

  const { deals = [] } = useSelector((state) => state.deal || { deals: [] });
  const { reviews = [] } = useSelector((state) => state.reviews || { reviews: [] });
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
  const data = homeAdmin.data?.[0] || {};

  useEffect(() => {
    dispatch(getDeals());
    dispatch(fetchReviews());
    dispatch(getHomeAdminData());
  }, [dispatch]);

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       await dispatch(getDeals()).unwrap();
//       toast.success("Deals loaded successfully!");
//     } catch (err) {
//       toast.error("Failed to load deals");
//     }

//     try {
//       await dispatch(fetchReviews()).unwrap();
//       toast.success("Reviews loaded successfully!");
//     } catch (err) {
//       toast.error("Failed to load reviews");
//     }

//     try {
//       await dispatch(getHomeAdminData()).unwrap();
//       toast.success("Home data loaded successfully!");
//     } catch (err) {
//       toast.error("Failed to load home page data");
//     }
//   };

//   fetchData();
// }, [dispatch]);


// useEffect(() => {
//   if (activeDeals.length === 0) toast.info("No active deals available.");
//   if (expiredDeals.length === 0) toast.info("No expired deals found.");
//   if (reviews.length === 0) toast.info("No user reviews yet.");
// }, [activeDeals, expiredDeals, reviews]);



  // Current date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter expired deals
  const expiredDeals = deals.filter((deal) => {
    const expiry = new Date(deal.expiredDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry < today;
  });

  // Filter active deals
  const activeDeals = deals.filter((deal) => {
    const expiry = new Date(deal.expiredDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry >= today;
  });

  return (
    <>
      <div>
        <h1 className="font-semibold text-xl max-w-[80%] px-4">
          ALL DEALS & COUPONS CODES
        </h1>

        <Banner text="" colorText="" BgImage={data.allCouponsPageBanner} />

        <TextLink text="All" colorText="Offers" link="" linkText="" />
        <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
          {activeDeals.length > 0 ? (
            activeDeals.map((deal) => <Coupons_Deals key={deal._id} data={deal} border={true} />)
          ) : (
            <p className="text-sm text-gray-500 px-4">No active coupons found.</p>
          )}
        </div>

        <TextLink text="Expired" colorText="Coupons" link="" linkText="" />
        <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
          {expiredDeals.length > 0 ? (
            expiredDeals.map((deal) => (
              <Coupons_Deals key={deal._id} data={deal} border={true} disabled={true} />
            ))
          ) : (
            <p className="text-sm text-gray-500 px-4">No expired coupons found.</p>
          )}
        </div>

        <TextLink text="User" colorText="Review" link="" linkText="" />
        <div className="p-4 flex gap-4 overflow-x-scroll">
          {reviews.length > 0 ? (
            reviews.map((review) => <ReviewCard key={review._id} data={review} />)
          ) : (
            <p className="text-sm text-gray-500">No reviews found.</p>
          )}
        </div>
      </div>

      <HeadingText
        title={data.allCouponsAboutHeading}
        content={data.allCouponsAboutDescription}
        isHtml={true}
      />
    </>
  );
};

export default AllCoupons;
