"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import TextLink from "../../../components/Minor/TextLink";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import PopularBrandCard from "../../../components/cards/PopularBrandWithText";
import DealCard from "../../../components/cards/DealCard";
import HeadingText from "../../../components/Minor/HeadingText";
import BarChartCard from "../../../components/charts/BarChart";
import { LiaPercentageSolid } from "react-icons/lia";
import { FaTruck } from "react-icons/fa6";
import { MdAssignmentReturned } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import FAQAccordion from "../../../components/Minor/Faq";
import { GridSkeleton, RowSkeleton, TextSkeleton } from "../../../components/skeletons/InlineSkeletons";
import ArrowScrollRow from "../../../components/Minor/ArrowScrollRow";

import { getDeals } from "../../../redux/deal/dealSlice";
import { getStores } from "../../../redux/store/storeSlice.js";
// import { toast } from "react-toastify";


const IndividualStore = () => {
  const params = useParams();
  const { slug } = params;
  const dispatch = useDispatch();
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const { deals = [] } = useSelector((state) => state.deal);
  const { stores = [], loading, error } = useSelector((state) => state.store);
  const { selectedCountry } = useSelector((state) => state.country || {});

  // const storeFromList = stores.find((store) => store._id === id);
  const storeFromList = stores.find(
    (store) => store.slug === slug
  );
  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
    dispatch(getStores(selectedCountry));
  }, [dispatch, selectedCountry]);

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

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <TextSkeleton className="h-8 w-56" />
        <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
        <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-36 rounded-lg bg-gray-200" />
      </div>
    );
  }
  if (!storeFromList) return <p className="text-center py-10">Store not found.</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  const description = storeFromList.storeDescription || "";
  const shouldTruncate = description.length > 140;
  const topCodes = deals.filter(
    (deal) => deal.store === storeFromList.storeName && deal.dealCategory === "coupon"
  );
  const topDeals = deals.filter(
    (deal) => deal.store === storeFromList.storeName && deal.dealCategory === "deal"
  );
  const popularStores = stores.filter((store) => store.popularStore);
  const hasHtmlContent = Boolean(storeFromList.storeHtmlContent);
  const totalOffers = topCodes.length + topDeals.length;

  return (
    <div>
      <section className="mx-6 mt-2 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-white/95 p-2 ring-2 ring-white/30 shadow sm:h-20 sm:w-20">
            <img
              src={storeFromList.storeImage}
              alt={`${storeFromList.storeName} logo`}
              className="h-full w-full rounded-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {storeFromList.storeName} Deals & Coupon Codes
            </h1>
            <div
              className={`mt-2 max-w-3xl overflow-hidden text-sm leading-relaxed text-white/85 transition-all duration-300 ease-in-out ${
                isDescExpanded ? "max-h-[26rem]" : "max-h-[4.5rem]"
              }`}
            >
              {description || `Explore the latest verified offers from ${storeFromList.storeName}.`}
            </div>
            {shouldTruncate && description ? (
              <button
                type="button"
                onClick={() => setIsDescExpanded((v) => !v)}
                className="mt-2 text-xs font-semibold text-white/90 underline underline-offset-2 hover:text-white"
                aria-expanded={isDescExpanded}
              >
                {isDescExpanded ? "Show less" : "Show more"}
              </button>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
                {totalOffers} Active Offers
              </span>
            </div>
          </div>
        </div>
      </section>

      {topCodes.length > 0 && (
        <>
          <TextLink text="Top Codes" colorText="" link="" linkText="" />
          <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
            {topCodes.map((deal) => (
              <Coupons_Deals key={deal._id} data={deal} border={true} />
            ))}
          </div>
        </>
      )}

      {topDeals.length > 0 && (
        <>
          <TextLink text="Top" colorText="Deals" link="/deal" linkText="View All" />
          <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex overflow-x-scroll">
            {topDeals.map((deal) => (
              <DealCard key={deal._id} data={deal} />
            ))}
          </ArrowScrollRow>
        </>
      )}

      {hasHtmlContent && (
        <HeadingText
          title={`About ${storeFromList.storeName}`}
          isHtml={true}
          content={storeFromList.storeHtmlContent}
        />
      )}

      {/* <BarChartCard
        data={chartData}
        title={`${chartData.reduce((sum, d) => sum + d.value, 0)} Codes`}
        subtitle={`Deal activity for ${storeFromList.storeName}`}
        total={`${chartData.reduce((sum, d) => sum + d.value, 0)} Codes`}
      /> */}

      {/* <div className="bg-[#F6F6F6] border border-[#E1E1E1] rounded-lg p-4 mx-2 flex justify-between items-center sm:max-w-[80%] sm:mx-auto">
        <div>
          <p>Coupons Updated Today</p>
          <p className="text-xl font-semibold text-[#592EA9]">{todayCount}</p>
        </div>
        <LiaPercentageSolid className="text-[#592EA9] text-4xl" />
      </div> */}

      {/* <div className="pt-3 flex justify-between mx-2 gap-4 sm:max-w-[80%] sm:mx-auto">
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
      </div> */}

      {popularStores.length > 0 && (
        <div className="bg-[#592EA9] text-white my-4">
          <p className="px-4 py-2">Popular Stores</p>
          <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
            {popularStores.map((store) => (
              <PopularBrandCard key={store._id} data={store} />
            ))}
          </ArrowScrollRow>
        </div>
      )}

      <FAQAccordion />
    </div>
  );
};

export default IndividualStore;
