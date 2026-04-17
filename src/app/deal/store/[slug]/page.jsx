"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import TextLink from "../../../../components/Minor/TextLink";
import Coupons_Deals from "../../../../components/cards/Coupons_Deals";
import HeadingText from "../../../../components/Minor/HeadingText";
import { getDeals } from "../../../../redux/deal/dealSlice";
import { GridSkeleton } from "../../../../components/skeletons/InlineSkeletons";
import { slugify, titleize } from "../../../../lib/slugify";

const StoreDealsPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const storeSlug = params?.slug ? decodeURIComponent(params.slug) : "";
  const storeName = titleize(storeSlug.replace(/-/g, " "));
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });
  const { selectedCountry } = useSelector((state) => state.country || {});

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
  }, [dispatch, selectedCountry]);

  const filteredDeals = deals.filter((deal) => slugify(deal.store || "") === storeSlug);
  const hasDeals = filteredDeals.length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [storeSlug, selectedCountry]);

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
        </div>
      </section>

      {(dealsLoading || hasDeals) && (
        <TextLink text={storeName} colorText="Deals" link="" linkText="" />
      )}

      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : hasDeals ? (
          pagedDeals.map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this store.</p>
        )}
      </div>

      {hasDeals && (
        <div className="mt-6 px-2">
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
                        <span className="px-1 text-xs font-semibold text-[#9A8CC3]">…</span>
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
