"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextLink from "@/components/Minor/TextLink";
import DealCard from "@/components/cards/DealCard";
import PopularBrandCard from "@/components/cards/PopularBrandWithText";
import Coupons_Deals from "@/components/cards/Coupons_Deals";
import DealOfWeek from "@/components/cards/DealOfWeek";
import ReviewCard from "@/components/cards/ReviewCard";
import { fetchReviews } from "@/redux/review/reviewSlice";
import { getDeals } from "@/redux/deal/dealSlice";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
const SingleCategoryContent = () => {
    const dispatch = useDispatch();
    const { reviews = [] } = useSelector((state) => state.reviews);
    const { deals = [] } = useSelector((state) => state.deal);
  
    const searchParams = useSearchParams();
    const category = searchParams?.get("name") || "All";
  
    const filteredDeals = deals.filter((deal) => deal.categorySelect === category);
  
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleSortClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
  
    useEffect(() => {
      dispatch(getDeals());
      dispatch(fetchReviews());
    }, [dispatch]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div>
          <Typography variant="body1" fontWeight="bold" className="text-lg">
            {category}
          </Typography>
          <Typography>{filteredDeals.length} Offers</Typography>
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <button
            onClick={handleSortClick}
            className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-md"
          >
            Sort <ArrowDropDownIcon className="ml-1" />
          </button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem onClick={handleClose}>Sort by Popularity</MenuItem>
            <MenuItem onClick={handleClose}>Sort by Name</MenuItem>
            <MenuItem onClick={handleClose}>Sort by Newest</MenuItem>
          </Menu>
        </div>
      </div>

      {/* Section Links */}
      <TextLink text={category} colorText="deals worth wearing" link="" linkText="" />

      {/* Deals */}
      <div className="flex overflow-x-scroll gap-4 px-4">
        {[...Array(4)].map((_, index) => (
          <DealCard key={`placeholder-${index}`} />
        ))}
        {filteredDeals
          .filter((store) => store.dealCategory === "deal")
          .map((deal) => (
            <DealCard key={deal._id} data={deal} />
          ))}
      </div>

      {/* Coupons Section */}
      <div className="bg-[#592EA9] text-white my-4">
        <p className="px-4 py-2">{category} Coupon</p>
        <div className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
          {filteredDeals
            .filter((store) => store.dealCategory === "coupon")
            .map((store) => (
              <PopularBrandCard key={store._id} data={store} />
            ))}
        </div>
      </div>

      <TextLink text="Coupons" colorText="& Deals" link="" linkText="View All" />

      {/* All Deals */}
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {filteredDeals.map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </div>

      {/* Deal of the Week */}
      <TextLink text="Deal of the " colorText="Week" link="" linkText="View All" />
      <div className="flex overflow-x-scroll gap-4 px-4">
        {[...Array(4)].map((_, index) => (
          <DealOfWeek key={`placeholder-week-${index}`} />
        ))}
        {filteredDeals
          .filter((deal) => deal.dealType === "Deal of week")
          .map((deal) => (
            <DealOfWeek key={deal._id} data={deal} />
          ))}
      </div>

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};
const SingleCategory = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SingleCategoryContent />
      </Suspense>
    );
  };
export default SingleCategory;
