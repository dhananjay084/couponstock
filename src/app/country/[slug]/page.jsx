"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import TextLink from "../../../components/Minor/TextLink";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import HeadingText from "../../../components/Minor/HeadingText";
import { getDeals } from "../../../redux/deal/dealSlice";
import { GridSkeleton } from "../../../components/skeletons/InlineSkeletons";
import { titleize } from "../../../lib/slugify";
import { setSelectedCountry } from "../../../redux/country/countrySlice";
import { addCountryPrefix } from "../../../lib/countryPath";

const CountryDealsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const countrySlug = params?.slug ? decodeURIComponent(params.slug) : "";
  const countryName = titleize(countrySlug.replace(/-/g, " "));
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });

  useEffect(() => {
    if (countryName) {
      dispatch(setSelectedCountry(countryName));
    }
    dispatch(getDeals(countryName));
  }, [dispatch, countryName]);

  useEffect(() => {
    if (!countryName) return;
    router.replace(addCountryPrefix("/deal", countryName));
  }, [countryName, router]);

  const filteredDeals = deals.filter((deal) =>
    Array.isArray(deal.country)
      ? deal.country.some((c) => c?.toLowerCase?.() === countryName.toLowerCase())
      : deal.country?.toLowerCase?.() === countryName.toLowerCase()
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [countrySlug]);

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
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#592EA9] mb-4">
        Deals in {countryName}
      </h1>

      <TextLink text={countryName} colorText="Deals" link="" linkText="" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {dealsLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : filteredDeals.length > 0 ? (
          pagedDeals.map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this country.</p>
        )}
      </div>

      {filteredDeals.length > 0 && (
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

      <HeadingText
        title={`${countryName} Deals`}
        content={`Browse the latest offers, coupons, and deals available in ${countryName}.`}
        isHtml={false}
      />
    </div>
  );
};

export default CountryDealsPage;
