"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Menu, MenuItem, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextLink from "../../../components/Minor/TextLink";
import DealCard from "../../../components/cards/DealCard";
import PopularBrandCard from "../../../components/cards/PopularBrandWithText";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import DealOfWeek from "../../../components/cards/DealOfWeek";
import { getDeals } from "../../../redux/deal/dealSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { slugify, titleize } from "../../../lib/slugify";
import { GridSkeleton, RowSkeleton, TextSkeleton } from "../../../components/skeletons/InlineSkeletons";
import ArrowScrollRow from "../../../components/Minor/ArrowScrollRow";

const SingleCategoryContent = () => {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal);
  const { selectedCountry } = useSelector((state) => state.country || {});

  // Read the category from the dynamic route param `[id]`
  const params = useParams();
  const categoryParam = params?.id ? decodeURIComponent(params.id).trim().toLowerCase() : "all";
  const categoryDisplay = categoryParam === "all" ? "All" : titleize(categoryParam);

  // Filter deals based on category
  const filteredDeals = categoryParam === "all"
    ? deals
    : deals.filter((deal) => slugify(deal?.categorySelect || "") === categoryParam);

  // Sorting menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
  }, [dispatch, selectedCountry]);

  return (
    <Box>
      <h1 className="px-4 pt-2 text-2xl font-bold text-[#592EA9]">
        {categoryDisplay}
      </h1>
      {/* Header */}
      <Box className="flex justify-between items-center px-4" sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="body1" fontWeight="bold" className="text-lg">
            {categoryDisplay}
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
      <TextLink text={categoryDisplay} colorText="deals worth wearing" link="" linkText="" />

      {/* Deals */}
      <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4 py-2 scrollbar-hide">
        {filteredDeals.length === 0 ? (
          <RowSkeleton count={4} />
        ) : filteredDeals
          .filter((store) => store.dealCategory === "deal")
          .map((deal) => (
            <DealCard key={deal._id} data={deal} />
          ))}
      </ArrowScrollRow>

      {/* Coupons Section */}
      <Box className="bg-[#592EA9] text-white my-4">
        <Typography sx={{ px: 4, py: 2, fontWeight: "bold" }}>
          {categoryDisplay} Coupon
        </Typography>
        <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
          {filteredDeals.length === 0 ? (
            <RowSkeleton count={3} />
          ) : filteredDeals
            .filter((store) => store.dealCategory === "coupon")
            .map((store) => (
              <PopularBrandCard key={store._id} data={store} />
            ))}
        </ArrowScrollRow>
      </Box>

      <TextLink text="Coupons" colorText="& Deals" link="" linkText="View All" />

      {/* All Deals Grid */}
      <Box className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around" sx={{ px: 4 }}>
        {filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : filteredDeals.map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </Box>

      {/* Deal of the Week */}
      <TextLink text="Deal of the " colorText="Week" link="" linkText="View All" />
      <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4 py-2 scrollbar-hide">
        {filteredDeals.length === 0 ? (
          <RowSkeleton count={4} />
        ) : filteredDeals
          .filter((deal) => deal.dealType === "Deal of week")
          .map((deal) => (
            <DealOfWeek key={deal._id} data={deal} />
          ))}
      </ArrowScrollRow>

    </Box>
  );
};

const SingleCategory = () => {
  return (
    <Suspense fallback={<div className="p-4 space-y-4"><TextSkeleton className="h-8 w-48" /><RowSkeleton count={3} /></div>}>
      <SingleCategoryContent />
    </Suspense>
  );
};

export default SingleCategory;
