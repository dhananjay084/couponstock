"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Menu, MenuItem, Typography, Box } from "@mui/material";
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
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

// Loading fallback UI
export async function generateMetadata({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories/${params.id}`,
    { cache: "no-store" }
  );

  const category = await res.json();

  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || "",
    keywords: category.metaKeywords || "",
  };
}
const LoadingFallback = () => (
  <Box className="flex justify-center items-center h-screen">
    <Typography variant="h5">Loading category deals...</Typography>
  </Box>
);

const SingleCategoryContent = () => {
  const dispatch = useDispatch();
  const { reviews = [] } = useSelector((state) => state.reviews);
  const { deals = [] } = useSelector((state) => state.deal);

  // Read the category from the dynamic route param `[id]`
  const params = useParams();
  const category = params?.id ? decodeURIComponent(params.id).trim() : "All";

  // Filter deals based on category
  const filteredDeals = deals.filter((deal) => deal.categorySelect === category);

  // Sorting menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(getDeals())
      .unwrap()
      .catch(() => toast.error("Failed to load deals"));

    dispatch(fetchReviews())
      .unwrap()
      .catch(() => toast.error("Failed to load reviews"));
  }, [dispatch]);

  return (
    <Box>
      {/* Header */}
      <Box className="flex justify-between items-center px-4" sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="body1" fontWeight="bold" className="text-lg">
            {category}
          </Typography>
          <Typography>{filteredDeals.length} Offers</Typography>
        </Box>

        {/* Sort */}
        <Box className="flex gap-2">
          {/* <button
            onClick={handleSortClick}
            className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-md"
          >
            Sort <ArrowDropDownIcon className="ml-1" />
          </button> */}

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
        </Box>
      </Box>

      {/* Section Links */}
      <TextLink text={category} colorText="deals worth wearing" link="" linkText="" />

      {/* Deals */}
      <Box className="flex overflow-x-scroll gap-4 px-4 scrollbar-hide" sx={{ py: 2 }}>
        {[...Array(4)].map((_, index) => (
          <DealCard key={`placeholder-${index}`} />
        ))}
        {filteredDeals
          .filter((store) => store.dealCategory === "deal")
          .map((deal) => (
            <DealCard key={deal._id} data={deal} />
          ))}
      </Box>

      {/* Coupons Section */}
      <Box className="bg-[#592EA9] text-white my-4">
        <Typography sx={{ px: 4, py: 2, fontWeight: "bold" }}>
          {category} Coupon
        </Typography>
        <Box className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
          {filteredDeals
            .filter((store) => store.dealCategory === "coupon")
            .map((store) => (
              <PopularBrandCard key={store._id} data={store} />
            ))}
        </Box>
      </Box>

      <TextLink text="Coupons" colorText="& Deals" link="" linkText="View All" />

      {/* All Deals Grid */}
      <Box className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around" sx={{ px: 4 }}>
        {filteredDeals.map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </Box>

      {/* Deal of the Week */}
      <TextLink text="Deal of the " colorText="Week" link="" linkText="View All" />
      <Box className="flex overflow-x-scroll gap-4 px-4 scrollbar-hide" sx={{ py: 2 }}>
        {[...Array(4)].map((_, index) => (
          <DealOfWeek key={`placeholder-week-${index}`} />
        ))}
        {filteredDeals
          .filter((deal) => deal.dealType === "Deal of week")
          .map((deal) => (
            <DealOfWeek key={deal._id} data={deal} />
          ))}
      </Box>

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <Box className="p-4 flex gap-4 overflow-x-scroll scrollbar-hide" sx={{ py: 2 }}>
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <Typography>No reviews found.</Typography>
        )}
      </Box>
    </Box>
  );
};

const SingleCategory = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SingleCategoryContent />
    </Suspense>
  );
};

export default SingleCategory;
