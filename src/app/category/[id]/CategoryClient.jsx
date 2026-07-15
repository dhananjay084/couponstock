"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Menu, MenuItem, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextLink from "../../../components/Minor/TextLink";
import DealCard from "../../../components/cards/DealCard";
import PopularBrandCard from "../../../components/cards/PopularBrandWithText";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import DealOfWeek from "../../../components/cards/DealOfWeek";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getDeals } from "../../../redux/deal/dealSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { slugify, titleize } from "../../../lib/slugify";
import { GridSkeleton, RowSkeleton } from "../../../components/skeletons/InlineSkeletons";
import ArrowScrollRow from "../../../components/Minor/ArrowScrollRow";

const SingleCategoryContent = ({ initialDeals = [], categoryData = null }) => {
  const dispatch = useDispatch();
  const { deals: liveDeals = [] } = useSelector((state) => state.deal);
  const deals = Array.isArray(liveDeals) && liveDeals.length > 0 ? liveDeals : initialDeals;

  // Read the category from the dynamic route param `[id]`
  const params = useParams();
  const categoryParam = params?.id ? decodeURIComponent(params.id).trim().toLowerCase() : "all";
  const categoryDisplay = categoryParam === "all" ? "All" : titleize(categoryParam);
  const pageHeading = String(categoryData?.pageHeading || "").trim() || categoryDisplay;
  const pageDescription = String(categoryData?.pageDescription || "").trim();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter deals based on category
  const filteredDeals = categoryParam === "all"
    ? deals
    : deals.filter((deal) => slugify(deal?.categorySelect || "") === categoryParam);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam]);

  const totalPages = useMemo(() => {
    const next = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE);
    return next > 0 ? next : 1;
  }, [ITEMS_PER_PAGE, filteredDeals.length]);

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const pagedDeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeals.slice(start, start + ITEMS_PER_PAGE);
  }, [ITEMS_PER_PAGE, currentPage, filteredDeals]);

  const pageButtons = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = new Set([1, totalPages]);
    for (let p = currentPage - 2; p <= currentPage + 2; p += 1) {
      if (p >= 1 && p <= totalPages) pages.add(p);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const showingFrom = filteredDeals.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filteredDeals.length);
  const weeklyDeals = filteredDeals.filter((deal) => deal.dealType === "Deal of week");
  const weeklyDealsPrevRef = useRef(null);
  const weeklyDealsNextRef = useRef(null);

  // Sorting menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(getDeals());
  }, [dispatch]);

  return (
    <Box>
      <h1 className="px-4 pt-2 text-2xl font-bold text-[#592EA9]">
        {pageHeading}
      </h1>
      {pageDescription ? (
        <p className="px-4 pt-2 text-sm leading-7 text-[#5B5370]">
          {pageDescription}
        </p>
      ) : null}
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
      <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6" sx={{ px: 4 }}>
        {filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : pagedDeals.map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </Box>

      {filteredDeals.length > 0 && (
        <div className="mt-6 px-4">
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E4D8FF] bg-white/80 px-4 py-3 shadow-sm sm:flex-row">
            <p className="text-xs font-semibold text-[#4A3C6A]">
              Showing {showingFrom}-{showingTo} of {filteredDeals.length}
            </p>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    currentPage === 1
                      ? "cursor-not-allowed border border-[#E4D8FF] bg-white text-[#9A8CC3]"
                      : "border border-[#E4D8FF] bg-white text-[#4A3C6A] hover:bg-[#F2EBFF]"
                  }`}
                  aria-label="Previous page"
                >
                  Prev
                </button>

                {pageButtons.map((p, idx) => {
                  const prev = pageButtons[idx - 1];
                  const needsDots = idx > 0 && prev && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {needsDots ? (
                        <span className="px-1 text-xs font-semibold text-[#9A8CC3]">...</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-9 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          currentPage === p
                            ? "bg-[#5B3CC4] text-white shadow"
                            : "border border-[#E4D8FF] bg-white text-[#4A3C6A] hover:bg-[#F2EBFF]"
                        }`}
                        aria-current={currentPage === p ? "page" : undefined}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    currentPage === totalPages
                      ? "cursor-not-allowed border border-[#E4D8FF] bg-white text-[#9A8CC3]"
                      : "border border-[#E4D8FF] bg-white text-[#4A3C6A] hover:bg-[#F2EBFF]"
                  }`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deal of the Week */}
      <TextLink text="Deal of the " colorText="Week" link="" linkText="View All" />
      <div className="lg:hidden">
        <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4 py-2 scrollbar-hide">
          {filteredDeals.length === 0 ? (
            <RowSkeleton count={4} />
          ) : weeklyDeals.map((deal) => (
            <DealOfWeek key={deal._id} data={deal} />
          ))}
        </ArrowScrollRow>
      </div>

      <div className="hidden lg:block px-4">
        {filteredDeals.length === 0 ? (
          <GridSkeleton
            count={6}
            className="grid grid-cols-3 gap-4 xl:grid-cols-6"
            itemClassName="aspect-square rounded-2xl bg-gray-200"
          />
        ) : weeklyDeals.length > 6 ? (
          <div className="coupon-section p-4">
            <div className="mb-3 flex items-center justify-end gap-2 pr-1">
              <button
                type="button"
                aria-label="Previous weekly deal"
                ref={weeklyDealsPrevRef}
                className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next weekly deal"
                ref={weeklyDealsNextRef}
                className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
              >
                ›
              </button>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: weeklyDealsPrevRef.current, nextEl: weeklyDealsNextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = weeklyDealsPrevRef.current;
                swiper.params.navigation.nextEl = weeklyDealsNextRef.current;
              }}
              spaceBetween={16}
              breakpoints={{
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 6 },
              }}
            >
              {weeklyDeals.map((deal) => (
                <SwiperSlide key={deal._id} className="coupon-equal-slide">
                  <DealOfWeek data={deal} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="coupon-section coupon-section-inner grid grid-cols-3 gap-4 xl:grid-cols-6">
            {weeklyDeals.map((deal) => (
              <DealOfWeek key={deal._id} data={deal} />
            ))}
          </div>
        )}
      </div>

    </Box>
  );
};

const SingleCategory = ({ initialDeals = [], categoryData = null }) => (
  <SingleCategoryContent initialDeals={initialDeals} categoryData={categoryData} />
);

export default SingleCategory;
