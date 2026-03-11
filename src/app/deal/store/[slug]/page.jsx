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

  useEffect(() => {
    dispatch(getDeals());
    dispatch(fetchReviews());
  }, [dispatch]);

  const filteredDeals = deals.filter((deal) => slugify(deal.store || "") === storeSlug);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#592EA9] mb-4">
        Deals from {storeName}
      </h1>

      <TextLink text={storeName} colorText="Deals" link="" linkText="" />

      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this store.</p>
        )}
      </div>

      <TextLink text="User" colorText="Review" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {reviewsLoading && reviews.length === 0 ? (
          <RowSkeleton count={3} />
        ) : reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p className="text-sm text-gray-500">No reviews found.</p>
        )}
      </div>

      <HeadingText
        title={`${storeName} Deals`}
        content={`Browse the latest offers, coupons, and deals from ${storeName}.`}
        isHtml={false}
      />
    </div>
  );
};

export default StoreDealsPage;
