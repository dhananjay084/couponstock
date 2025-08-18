"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import TextLink from "@/components/Minor/TextLink";
import Coupons_Deals from "@/components/cards/Coupons_Deals";
import PopularBrandCard from "@/components/cards/PopularBrandWithText";
import DealCard from "@/components/cards/DealCard";
import HeadingText from "@/components/Minor/HeadingText";
import BarChartCard from "@/components/charts/BarChart";
import { LiaPercentageSolid } from "react-icons/lia";
import { FaTruck } from "react-icons/fa6";
import { MdAssignmentReturned } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import ReviewCard from "@/components/cards/ReviewCard";
import FAQAccordion from "@/components/Minor/Faq";

import { getDeals } from "@/redux/deal/dealSlice";
import { getStores } from "@/redux/store/storeSlice.js";
import { fetchReviews } from "@/redux/review/reviewSlice";

const IndividualStore = () => {
  const params = useParams();
  const { id } = params; // Next.js params from app router
  const dispatch = useDispatch();

  const { deals = [] } = useSelector((state) => state.deal);
  const { stores = [], loading, error } = useSelector((state) => state.store);
  const { reviews = [] } = useSelector((state) => state.reviews);

  const storeFromList = stores.find((store) => store._id === id);

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getStores());
    dispatch(fetchReviews());
  }, [dispatch]);

  const { chartData, todayCount } = useMemo(() => {
    const now = new Date();
    const dateLabels = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dateLabels.push({
        date: d.toISOString().split("T")[0],
        label:
          i === 0
            ? "Today"
            : d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      });
    }

    let todayCount = 0;

    const counts = dateLabels.map(({ date, label }) => {
      const count = deals.filter((deal) => {
        const dealDate = new Date(deal.updatedAt).toISOString().split("T")[0];
        const isSameDay = dealDate === date;
        const isSameStore = deal.store === storeFromList?.storeName;

        if (
          isSameDay &&
          isSameStore &&
          date === now.toISOString().split("T")[0]
        ) {
          todayCount++;
        }

        return isSameDay && isSameStore;
      }).length;

      return { day: label, value: count };
    });

    return { chartData: counts, todayCount };
  }, [deals, storeFromList]);

  if (loading || !storeFromList)
    return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div>
      <TextLink
        text={storeFromList.storeName}
        colorText="Offers"
        link=""
        linkText=""
      />

      <div className="border-b pb-2 mb-4 px-4 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
        <img
          src={storeFromList.storeImage}
          alt="store"
          className="w-40 h-40 rounded-full object-fill border-4 border-[#592EA9]"
        />

        <Typography sx={{ fontSize: "13px" }}>
          {storeFromList.storeDescription}
        </Typography>
      </div>

      <TextLink text="Top Codes" colorText="" link="" linkText="" />
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {deals
          .filter(
            (deal) =>
              deal.store === storeFromList.storeName &&
              deal.dealCategory === "coupon"
          )
          .map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))}
      </div>

      <div className="bg-[#592EA9] text-white my-4">
        <p className="px-4 py-2">Popular Stores</p>
        <div className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
          {stores
            .filter((store) => store.popularStore)
            .map((store) => (
              <PopularBrandCard key={store._id} data={store} />
            ))}
        </div>
      </div>

      <TextLink text="Top" colorText="Deals" link="/home" linkText="View All" />
      <div className="flex overflow-x-scroll">
        {deals
          .filter(
            (deal) =>
              deal.store === storeFromList.storeName &&
              deal.dealCategory === "deal"
          )
          .map((deal) => (
            <DealCard key={deal._id} data={deal} />
          ))}
      </div>

      <HeadingText
        title={storeFromList.storeName}
        isHtml={true}
        content={storeFromList.storeHtmlContent}
      />

      <BarChartCard
        data={chartData}
        title={`${chartData.reduce((sum, d) => sum + d.value, 0)} Codes`}
        subtitle={`Deal activity for ${storeFromList.storeName}`}
        total={`${chartData.reduce((sum, d) => sum + d.value, 0)} Codes`}
      />

      <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 mx-2 flex justify-between items-center sm:max-w-[80%] sm:mx-auto">
        <div>
          <p>Coupons Updated Today</p>
          <p className="text-xl font-semibold text-[#592EA9]">{todayCount}</p>
        </div>
        <LiaPercentageSolid className="text-[#592EA9] text-4xl" />
      </div>

      <div className="pt-3 flex justify-between mx-2 gap-4 sm:max-w-[80%] sm:mx-auto">
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>Total Offers</p>
          <p className="text-xl font-semibold text-[#592EA9]">{`${chartData.reduce(
            (sum, d) => sum + d.value,
            0
          )} `}</p>
        </div>
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>Biggest discount</p>
          <p className="text-xl font-semibold text-[#592EA9]">
            {storeFromList.discountPercentage}%
          </p>
        </div>
      </div>

      <div className="sm:max-w-[80%] sm:mx-auto">
        <TextLink text="Shopping" colorText="& Policy" link="" linkText="" />
      </div>
      <div className="pt-3 flex justify-between mx-2 gap-4 sm:max-w-[80%] sm:mx-auto">
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>Free Shipping</p>
          <FaTruck className="text-[#592EA9] text-3xl" />
        </div>
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>Free Returns</p>
          <MdAssignmentReturned className="text-[#592EA9] text-3xl" />
        </div>
      </div>
      <div className="pt-3 flex justify-between mx-2 gap-4 sm:max-w-[80%] sm:mx-auto">
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>Send coupons via email</p>
          <RiCoupon2Fill className="text-[#592EA9] text-3xl" />
        </div>
        <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 w-full">
          <p>International ship</p>
          <FaCheckCircle className="text-[#592EA9] text-3xl" />
        </div>
      </div>

      <TextLink text="User" colorText="Reviews" link="" linkText="" />
      <div className="px-4 flex gap-4 overflow-x-scroll">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>

      <FAQAccordion />
    </div>
  );
};

export default IndividualStore;
