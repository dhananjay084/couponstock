"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import TextLink from "../../../components/Minor/TextLink";
import TopDealShowcaseCard from "../../../components/cards/TopDealShowcaseCard";
import DealOfWeek from "../../../components/cards/DealOfWeek";
import HeadingText from "../../../components/Minor/HeadingText";
import { GridSkeleton } from "../../../components/skeletons/InlineSkeletons";
import { getDeals } from "../../../redux/deal/dealSlice";
import { getStores } from "../../../redux/store/storeSlice";
import { setSelectedCountry } from "../../../redux/country/countrySlice";
import { addCountryPrefix, getCountryCodeFromName } from "../../../lib/countryPath";

const ITEMS_PER_PAGE = 10;

const CONFIG = {
  top: {
    pageTitle: "Today's Top Deals",
    heroTitle: "Today's Top Deals",
    heroDescription: "Browse the best handpicked offers featured on the homepage.",
    textLinkText: "Today's Top",
    textLinkColor: "Deals",
    aboutTitle: "Today's Top Deals",
    aboutDescription: "Browse the latest handpicked top deals and savings opportunities from MyCouponStock.",
    matcher: (deal) =>
      deal?.showOnHomepage &&
      deal?.dealType === "Today's Top Deal" &&
      deal?.dealCategory === "deal",
    renderCard: (deal, storesByName) => (
      <TopDealShowcaseCard
        key={deal._id}
        deal={deal}
        store={storesByName.get(String(deal?.store || "").toLowerCase())}
      />
    ),
    gridClassName: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  },
  week: {
    pageTitle: "Deal of the Week",
    heroTitle: "Deal of the Week",
    heroDescription: "Explore the weekly featured deals highlighted on the homepage.",
    textLinkText: "Deal of the",
    textLinkColor: "Week",
    aboutTitle: "Deal of the Week",
    aboutDescription: "Browse the latest weekly featured deals and offers from MyCouponStock.",
    matcher: (deal) =>
      deal?.showOnHomepage &&
      deal?.dealType === "Deal of week" &&
      deal?.dealCategory === "deal",
    renderCard: (deal) => <DealOfWeek key={deal._id} data={deal} />,
    gridClassName: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  },
};

export default function DealTypeListingClient({ variant = "top" }) {
  const config = CONFIG[variant] || CONFIG.top;
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || {});
  const { stores = [], loading: storesLoading } = useSelector((state) => state.store || {});
  const { selectedCountry } = useSelector((state) => state.country || {});
  const routeCountry = String(params?.country || "").trim();
  const routeCountryCode = getCountryCodeFromName(routeCountry);
  const selectedCountryCode = getCountryCodeFromName(selectedCountry);
  const resolvedCountry = selectedCountry || routeCountry || "";
  const resolvedCountryCode = selectedCountryCode || routeCountryCode;
  const requestCountry = resolvedCountryCode === "gl" ? "" : resolvedCountry;
  const basePath = variant === "week" ? "/deal/deal-of-week" : "/deal/todays-top";

  useEffect(() => {
    if (!selectedCountry) return;
    if (selectedCountryCode === routeCountryCode) return;
    router.replace(addCountryPrefix(basePath, selectedCountry));
  }, [basePath, routeCountryCode, router, selectedCountry, selectedCountryCode]);

  useEffect(() => {
    if (!resolvedCountry) return;
    dispatch(setSelectedCountry(resolvedCountry));
    dispatch(getDeals(requestCountry));
    if (variant === "top") {
      dispatch(getStores(requestCountry));
    }
  }, [dispatch, requestCountry, resolvedCountry, variant]);

  const filteredDeals = useMemo(
    () => deals.filter((deal) => config.matcher(deal)),
    [config, deals]
  );
  const hasDeals = filteredDeals.length > 0;

  const storesByName = useMemo(() => {
    const map = new Map();
    for (const store of stores || []) {
      if (!store?.storeName) continue;
      map.set(String(store.storeName).toLowerCase(), store);
    }
    return map;
  }, [stores]);

  useEffect(() => {
    setCurrentPage(1);
  }, [variant, resolvedCountry]);

  const totalPages = useMemo(() => {
    const next = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE);
    return next > 0 ? next : 1;
  }, [filteredDeals.length]);

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const pagedDeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeals.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredDeals]);

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
  const isLoading = variant === "top" ? dealsLoading || storesLoading : dealsLoading;

  return (
    <div className="site-shell p-4">
      <section className="mx-2 mt-2 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {config.heroTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          {config.heroDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {filteredDeals.length} Active Offers
          </span>
        </div>
      </section>

      {(isLoading || hasDeals) && (
        <TextLink text={config.textLinkText} colorText={config.textLinkColor} link="" linkText="" />
      )}

      <div className={config.gridClassName}>
        {isLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className={config.gridClassName} itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : hasDeals ? (
          pagedDeals.map((deal) => (
            <div key={deal._id} className="min-w-0 h-full">
              {config.renderCard(deal, storesByName)}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this section.</p>
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
          title={config.aboutTitle}
          content={config.aboutDescription}
          isHtml={false}
        />
      )}
    </div>
  );
}
