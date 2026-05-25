"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextLink from "../../../components/Minor/TextLink";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import PopularBrandCard from "../../../components/cards/PopularBrandWithText";
import DealCard from "../../../components/cards/DealCard";
import HeadingText from "../../../components/Minor/HeadingText";
import FAQAccordion from "../../../components/Minor/Faq";
import { GridSkeleton, TextSkeleton } from "../../../components/skeletons/InlineSkeletons";
import CountryAvailabilityGate from "../../../components/Minor/CountryAvailabilityGate";
import ArrowScrollRow from "../../../components/Minor/ArrowScrollRow";
import { getCachedStoreDetailPayload } from "../../../lib/storeDetailCache";
import { buildPublicApiUrl } from "../../../lib/publicApiBase";
import { slugify } from "../../../lib/slugify";
import { addCountryPrefix } from "../../../lib/countryPath";
import { getDeals } from "../../../redux/deal/dealSlice";
// import { toast } from "react-toastify";

const normalizeDealCategory = (value) => String(value || "").trim().toLowerCase();
const getDealStoreKeys = (deal = {}) =>
  [...new Set([deal?.store, deal?.storeName, deal?.storeSlug].map((value) => slugify(String(value || ""))).filter(Boolean))];

const IndividualStore = ({ store, initialDeals = [], initialPopularStores = [] }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { slug } = params;
  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || {});
  const { selectedCountry } = useSelector((state) => state.country || {});
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [cachedPayload, setCachedPayload] = useState(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const [storeData, setStoreData] = useState(store || null);
  const [popularStoresData, setPopularStoresData] = useState(
    Array.isArray(initialPopularStores) ? initialPopularStores : []
  );
  const [isLoadingRemote, setIsLoadingRemote] = useState(!store);

  useEffect(() => {
    setCachedPayload(getCachedStoreDetailPayload());
    setCacheLoaded(true);
  }, []);

  useEffect(() => {
    if (store) {
      setStoreData(store);
    }
  }, [store]);

  useEffect(() => {
    if (Array.isArray(initialPopularStores) && initialPopularStores.length > 0) {
      setPopularStoresData(initialPopularStores);
    }
  }, [initialPopularStores]);

  const cachedStore = cachedPayload?.slug === slug ? cachedPayload?.store : null;

  const storeFromList =
    storeData ||
    cachedStore ||
    null;
  const routeStoreKey = slugify(String(slug || ""));
  const storeNameKey = slugify(storeFromList?.storeName || "");
  const storeOfferHref = addCountryPrefix(
    `/deal/store/${encodeURIComponent(storeNameKey || routeStoreKey)}`,
    params?.country || ""
  );
  const belongsToStore = (deal) => {
    const dealStoreKeys = getDealStoreKeys(deal);
    if (dealStoreKeys.length === 0) return false;
    return dealStoreKeys.includes(routeStoreKey) || dealStoreKeys.includes(storeNameKey);
  };

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (!slug || storeData?.slug === slug) {
      setIsLoadingRemote(false);
      return;
    }

    let active = true;

    const loadStorePageData = async () => {
      let resolvedStore = null;

      try {
        setIsLoadingRemote(true);

        try {
          const storeRes = await axios.get(buildPublicApiUrl(`/api/stores/slug/${slug}`));
          resolvedStore = storeRes.data || null;
        } catch (error) {
          resolvedStore = cachedStore || storeData || store || null;
        }

        if (!active) return;

        if (!resolvedStore) {
          setStoreData(null);
          setPopularStoresData([]);
          return;
        }

        setStoreData(resolvedStore);
        const popularStoresParams = {
          popularStore: true,
          limit: 12,
        };

        const [, popularStoresRes] = await Promise.all([
          selectedCountry ? dispatch(getDeals(selectedCountry)) : Promise.resolve(),
          axios.get(buildPublicApiUrl("/api/stores"), {
            params: popularStoresParams,
          }),
        ]);

        if (!active) return;

        setPopularStoresData(Array.isArray(popularStoresRes.data) ? popularStoresRes.data : []);
      } catch (error) {
        if (!active) return;
        if (!resolvedStore) {
          setStoreData(null);
        }
        setPopularStoresData([]);
      } finally {
        if (active) {
          setIsLoadingRemote(false);
        }
      }
    };

    loadStorePageData();

    return () => {
      active = false;
    };
  }, [dispatch, slug, selectedCountry, storeData?.slug]);

  const resolvedDeals = useMemo(() => {
    const liveDeals = Array.isArray(deals) ? deals.filter((deal) => belongsToStore(deal)) : [];
    if (liveDeals.length > 0) return liveDeals;
    const fallbackDeals = Array.isArray(initialDeals) ? initialDeals.filter((deal) => belongsToStore(deal)) : [];
    return fallbackDeals;
  }, [deals, initialDeals, routeStoreKey, storeNameKey]);
  const popularStores = popularStoresData;

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
      const count = resolvedDeals.filter((deal) => {
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
  }, [resolvedDeals, storeFromList]);

  if ((!storeFromList && !cacheLoaded) || (isLoadingRemote && !storeFromList)) {
    return (
      <div className="p-4 space-y-4">
        <TextSkeleton className="h-8 w-56" />
        <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
        <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-36 rounded-lg bg-gray-200" />
      </div>
    );
  }
  if (!storeFromList) return <p className="text-center py-10">Store not found.</p>;

  const description = storeFromList.storeDescription || "";
  const shouldTruncate = description.length > 140;
  const topCodes = resolvedDeals.filter(
    (deal) =>
      belongsToStore(deal) &&
      normalizeDealCategory(deal?.dealCategory) === "coupon"
  );
  const topDeals = resolvedDeals.filter(
    (deal) =>
      belongsToStore(deal) &&
      normalizeDealCategory(deal?.dealCategory) === "deal"
  );
  const hasHtmlContent = Boolean(storeFromList.storeHtmlContent);
  const totalOffers = topCodes.length + topDeals.length;

  return (
    <CountryAvailabilityGate availableCountries={storeFromList.country} itemLabel="store">
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
          <TextLink text={storeFromList.storeName} colorText="Coupons" link="" linkText="" />
          <ArrowScrollRow
            controlsClassName="px-4"
            scrollerClassName="flex gap-4 overflow-x-auto px-2 pb-2"
          >
            {topCodes.map((deal) => (
              <Coupons_Deals key={deal._id} data={deal} border={true} />
            ))}
          </ArrowScrollRow>
        </>
      )}

      {topDeals.length > 0 && (
        <>
          <TextLink text={storeFromList.storeName} colorText="Deals" link={storeOfferHref} linkText="View All" />
          <ArrowScrollRow
            controlsClassName="px-4"
            scrollerClassName="flex gap-4 overflow-x-auto px-2 pb-2"
          >
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

      {totalOffers === 0 && (
        <div className="section-wrap section-block">
          <div className="rounded-3xl border border-[#E4D8FF] bg-white px-5 py-8 text-center text-sm text-[#5B5370] shadow-sm">
            {dealsLoading
              ? `Loading coupons and deals for ${storeFromList.storeName}...`
              : `No active coupons or deals are available for ${storeFromList.storeName} right now.`}
          </div>
        </div>
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
    </CountryAvailabilityGate>
  );
};

export default IndividualStore;
