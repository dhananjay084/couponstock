"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Minor/Banner";
import TextLink from "../../components/Minor/TextLink";
import HeadingText from "../../components/Minor/HeadingText";
import PopularBrandCard from "../../components/cards/PopularBrandWithTitle";
import { getStores } from "../../redux/store/storeSlice";
import { getDeals } from "../../redux/deal/dealSlice";
import { getHomeAdminData } from "../../redux/admin/homeAdminSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import BannerCard from "../../components/cards/BannerCards";
import { GridSkeleton, RowSkeleton } from "../../components/skeletons/InlineSkeletons";

const AllStores = ({
  stores: initialStores = [],
  deals: initialDeals = [],
  homeAdminData: initialHomeAdminData = [],
} = {}) => {
  const dispatch = useDispatch();

  const { stores: liveStores = [], loading, error } = useSelector((state) => state.store);
  const { deals: liveDeals = [] } = useSelector((state) => state.deal || {});
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const { selectedCountry } = useSelector((state) => state.country || {});
  const stores = Array.isArray(liveStores) && liveStores.length > 0 ? liveStores : initialStores;
  const deals = Array.isArray(liveDeals) && liveDeals.length > 0 ? liveDeals : initialDeals;
  const homeAdminData =
    Array.isArray(homeAdmin.data) && homeAdmin.data.length > 0 ? homeAdmin.data : initialHomeAdminData;
  const data = homeAdminData?.[0] || {};
  const countryHeading = useMemo(() => {
    if (!selectedCountry) return "";
    const label = String(selectedCountry || "").trim();
    if (!label) return "";
    const needsApostropheOnly = /s$/i.test(label);
    return needsApostropheOnly ? `${label}'` : `${label}'s`;
  }, [selectedCountry]);
  const pageBannerDeals =
    Array.isArray(data.storePageBannerDeals) && data.storePageBannerDeals.length > 0
      ? data.storePageBannerDeals
      : Array.isArray(data.listingBannerDeals) && data.listingBannerDeals.length > 0
        ? data.listingBannerDeals
        : data.bannerDeals;
  const [selectedLetter, setSelectedLetter] = useState("All");

  const alphabet = useMemo(
    () => ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))],
    []
  );

  const filteredStores = useMemo(() => {
    if (selectedLetter === "All") return stores;
    return stores.filter((store) =>
      store.storeName?.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  }, [stores, selectedLetter]);

  const dealCountsByStore = useMemo(() => {
    const counts = new Map();
    for (const deal of deals || []) {
      const key = String(deal?.store || "").trim().toLowerCase();
      if (!key) continue;
      const current = counts.get(key) || { coupons: 0, deals: 0 };
      if (deal?.dealCategory === "coupon") current.coupons += 1;
      if (deal?.dealCategory === "deal") current.deals += 1;
      counts.set(key, current);
    }
    return counts;
  }, [deals]);

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getStores(selectedCountry));
    dispatch(getDeals(selectedCountry));
    dispatch(getHomeAdminData(selectedCountry));
  }, [dispatch, selectedCountry]);

  return (
    <div>
      <section className="mx-2 mt-4 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {countryHeading ? `${countryHeading} ` : ""}All Stores
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          Explore verified stores, discover active offers, and browse by letter to find your favorite brand quickly.
        </p>
      </section>
      <div className="lg:hidden px-2 pb-4 mt-6">
        {homeAdmin.loading ? (
          <RowSkeleton count={2} itemClassName="h-36 w-full rounded-lg bg-gray-200" />
        ) : Array.isArray(pageBannerDeals) && pageBannerDeals.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={10}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              500: { slidesPerView: 2 },
              1024: { slidesPerView: 1 },
            }}
          >
            {pageBannerDeals.map((deal) => (
              <SwiperSlide key={deal._id} className="flex justify-center items-center">
                <BannerCard data={deal} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center w-full">No deals available</div>
        )}
      </div>

      <div className="lg:flex flex-wrap gap-4 p-4 justify-center lg:justify-between hidden">
        {homeAdmin.loading ? (
          <GridSkeleton count={3} className="grid grid-cols-3 gap-4 w-full" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : Array.isArray(pageBannerDeals) && pageBannerDeals.length > 0 ? (
          pageBannerDeals.length > 3 ? (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              spaceBetween={16}
              loop
              breakpoints={{
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
            >
              {pageBannerDeals.map((deal) => (
                <SwiperSlide key={deal._id} className="flex justify-center items-center">
                  <BannerCard data={deal} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            pageBannerDeals.map((deal) => (
              <div className="w-full sm:w-[48%] lg:w-[32%]" key={deal._id}>
                <BannerCard data={deal} />
              </div>
            ))
          )
        ) : (
          <div className="text-center w-full">No deals available</div>
        )}
      </div>

      <TextLink text="Brands" colorText="to Explore" link="" linkText="" />

      {loading && <p className="text-center text-lg font-medium">Loading stores...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      <div className="grid grid-cols-2 gap-4 px-4 mb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading && stores.length === 0 ? (
          <GridSkeleton count={12} className="grid grid-cols-2 gap-4 col-span-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" itemClassName="h-32 rounded-lg bg-gray-200" />
        ) : (
          stores.filter((store) => store.popularStore).map((store) => (
            <PopularBrandCard
              key={store._id}
              data={store}
              counts={dealCountsByStore.get(String(store?.storeName || "").toLowerCase())}
            />
          ))
        )}
      </div>

      <TextLink text="All" colorText="Stores" link="" linkText="" />
      <div className="w-full px-4 md:px-8 py-2 my-4">
        <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-4 py-2 rounded-[10px] border cursor-pointer ${
                  selectedLetter === letter
                    ? "bg-[#592EA9] text-white"
                    : "border-gray-400 text-gray-700"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 mb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading && stores.length === 0 ? (
          <GridSkeleton count={18} className="grid grid-cols-2 gap-4 col-span-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" itemClassName="h-32 rounded-lg bg-gray-200" />
        ) : filteredStores.length === 0 && !loading ? (
          <p className="text-center col-span-full text-gray-600">No stores found.</p>
        ) : (
          filteredStores.map((store) => (
            <PopularBrandCard
              key={store._id}
              data={store}
              counts={dealCountsByStore.get(String(store?.storeName || "").toLowerCase())}
            />
          ))
        )}
      </div>

      <HeadingText
        title={data.allStoresAboutHeading}
        content={data.allStoresAboutDescription || ""}
        isHtml={true}
      />
    </div>
  );
};

export default AllStores;
