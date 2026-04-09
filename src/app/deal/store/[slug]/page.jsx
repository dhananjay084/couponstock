"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import TextLink from "../../../../components/Minor/TextLink";
import Coupons_Deals from "../../../../components/cards/Coupons_Deals";
import ReviewCard from "../../../../components/cards/ReviewCard";
import HeadingText from "../../../../components/Minor/HeadingText";
import { getDeals } from "../../../../redux/deal/dealSlice";
import { fetchReviews } from "../../../../redux/review/reviewSlice";
import { GridSkeleton, RowSkeleton } from "../../../../components/skeletons/InlineSkeletons";
import { slugify, titleize } from "../../../../lib/slugify";

const StoreDealsPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const storeSlug = params?.slug ? decodeURIComponent(params.slug) : "";
  const storeName = titleize(storeSlug.replace(/-/g, " "));

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });
  const { reviews = [], loading: reviewsLoading } = useSelector((state) => state.reviews || { reviews: [], loading: false });
  const { selectedCountry } = useSelector((state) => state.country || {});

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
    dispatch(fetchReviews());
  }, [dispatch, selectedCountry]);

  const filteredDeals = deals.filter((deal) => slugify(deal.store || "") === storeSlug);
  const hasDeals = filteredDeals.length > 0;
  const hasReviews = reviews.length > 0;

  return (
    <div className="site-shell p-4">
      <section className="mx-2 mt-2 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {storeName} Deals & Coupon Codes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          Browse currently active offers from {storeName}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {filteredDeals.length} Active Offers
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {reviews.length} Reviews
          </span>
        </div>
      </section>

      {(dealsLoading || hasDeals) && (
        <TextLink text={storeName} colorText="Deals" link="" linkText="" />
      )}

      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : hasDeals ? (
          filteredDeals.map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this store.</p>
        )}
      </div>

      {(reviewsLoading || hasReviews) && (
        <>
          <TextLink text="User" colorText="Review" link="" linkText="" />
          <div className="p-4 flex gap-4 overflow-x-scroll">
            {reviewsLoading && !hasReviews ? (
              <RowSkeleton count={3} />
            ) : (
              reviews.map((review) => <ReviewCard key={review._id} data={review} />)
            )}
          </div>
        </>
      )}

      {hasDeals && (
        <HeadingText
          title={`${storeName} Deals`}
          content={`Browse the latest offers, coupons, and deals from ${storeName}.`}
          isHtml={false}
        />
      )}
    </div>
  );
};

export default StoreDealsPage;
