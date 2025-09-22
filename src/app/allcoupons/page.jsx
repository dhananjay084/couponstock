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
import { toast } from "react-toastify";
import AjioBanner from '../../assets/AjioBanner.png'
const AllCoupons = () => {
  const dispatch = useDispatch();

  const { deals = [] } = useSelector((state) => state.deal || { deals: [] });
  const { reviews = [] } = useSelector((state) => state.reviews || { reviews: [] });
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
  const data = homeAdmin.data?.[0] || {};

  // useEffect(() => {
  //   dispatch(getDeals());
  //   dispatch(fetchReviews());
  //   dispatch(getHomeAdminData());
  // }, [dispatch]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      await dispatch(getDeals()).unwrap();
      // toast.success("Deals loaded successfully!");
    } catch (err) {
      // toast.error("Failed to load deals");
    }

    try {
      await dispatch(fetchReviews()).unwrap();
      // toast.success("Reviews loaded successfully!");
    } catch (err) {
      toast.error("Failed to load reviews");
    }

    try {
      await dispatch(getHomeAdminData()).unwrap();
      // toast.success("Home data loaded successfully!");
    } catch (err) {
      toast.error("Failed to load home page data");
    }
  };

  fetchData();
}, [dispatch]);





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

  
useEffect(() => {
  if (activeDeals.length === 0) toast.info("No active deals available.");
  if (expiredDeals.length === 0) toast.info("No expired deals found.");
  if (reviews.length === 0) toast.info("No user reviews yet.");
}, [activeDeals, expiredDeals, reviews]);

  return (
    <>
      <div>
        <h1 className="font-semibold text-xl max-w-[80%] px-4">
          ALL DEALS & COUPONS CODES
        </h1>

        <Banner text="" colorText="" BgImage={AjioBanner} link= 'https://www.ajio.com/' />

        <TextLink text="All" colorText="Offers" link="" linkText="" />
        <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around max-h-[500px] overflow-y-auto">
          {activeDeals.length > 0 ? (
            activeDeals.map((deal) => <Coupons_Deals key={deal._id} data={deal} border={true} />)
          ) : (
            <p className="text-sm text-gray-500 px-4">No active coupons found.</p>
          )}
        </div>

        <TextLink text="Expired" colorText="Coupons" link="" linkText="" />
        <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around max-h-[500px] overflow-y-auto">
  {expiredDeals.length > 0 ? (
    expiredDeals.slice(0, 3).map((deal) => (
      <Coupons_Deals
        key={deal._id}
        data={deal}
        border={true}
        disabled={true}
      />
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
        content='This page contains all the brands that you can think of, from popular Indian names to leading international labels. This page is designed to make your shopping journey seamless and stress-free. Here, we’ve listed a wide range of stores covering almost every category you could want. Whether you’re on the hunt for a stylish dress from your favorite fashion brand, planning to book luxury airline tickets at a discount, or looking for the best deals on furniture, electronics, beauty products, or groceries, you’ll find it all right here.
To make things even easier, we’ve added a filter option so you can quickly search and discover the exact brand you’re looking for in just seconds. No endless scrolling, no wasted time just straight to the savings. This page is truly your one-stop destination for brands A to Z.  So dive in, filter your favorite brands, and enjoy a shopping experience where every store feels just a click away. Don’t forget to subscribe to our newsletter for upcoming exciting offers. Happy shopping.'
        isHtml={true}
      />
    </>
  );
};

export default AllCoupons;
