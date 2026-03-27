"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Minor/Banner";
import TextLink from "../../components/Minor/TextLink";
import HeadingText from "../../components/Minor/HeadingText";
import PopularBrandCard from "../../components/cards/PopularBrandWithTitle";
import { getStores } from "../../redux/store/storeSlice";
import { getHomeAdminData } from "../../redux/admin/homeAdminSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import BannerCard from "../../components/cards/BannerCards";
import { GridSkeleton, RowSkeleton } from "../../components/skeletons/InlineSkeletons";

const AllStores = () => {
  const dispatch = useDispatch();

  const { stores = [], loading, error } = useSelector((state) => state.store);
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const { selectedCountry } = useSelector((state) => state.country || {});
  const data = homeAdmin.data?.[0] || {};
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

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getStores(selectedCountry));
    dispatch(getHomeAdminData(selectedCountry));
  }, [dispatch, selectedCountry]);

  return (
    <div>
      <h1 className="px-4 pt-2 text-2xl font-bold text-[#592EA9]">Stores</h1>
      <div className="lg:hidden px-2 pb-4 mt-6">
        {homeAdmin.loading ? (
          <RowSkeleton count={2} itemClassName="h-36 w-full rounded-lg bg-gray-200" />
        ) : Array.isArray(pageBannerDeals) && pageBannerDeals.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
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
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 mb-6">
        {loading && stores.length === 0 ? (
          <GridSkeleton count={12} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 col-span-full" itemClassName="h-32 rounded-lg bg-gray-200" />
        ) : (
          stores.filter((store) => store.popularStore).map((store) => (
            <PopularBrandCard key={store._id} data={store} />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 mb-10">
        {loading && stores.length === 0 ? (
          <GridSkeleton count={18} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 col-span-full" itemClassName="h-32 rounded-lg bg-gray-200" />
        ) : filteredStores.length === 0 && !loading ? (
          <p className="text-center col-span-full text-gray-600">No stores found.</p>
        ) : (
          filteredStores.map((store) => <PopularBrandCard key={store._id} data={store} />)
        )}
      </div>

      <HeadingText
        title={data.allStoresAboutHeading}
        content='This page contains all the brands that you can think of, from popular Indian names to leading international labels. This page is designed to make your shopping journey seamless and stress-free. Here, we’ve listed a wide range of stores covering almost every category you could want. Whether you’re on the hunt for a stylish dress from your favorite fashion brand, planning to book luxury airline tickets at a discount, or looking for the best deals on furniture, electronics, beauty products, or groceries, you’ll find it all right here.
To make things even easier, we’ve added a filter option so you can quickly search and discover the exact brand you’re looking for in just seconds. No endless scrolling, no wasted time just straight to the savings. This page is truly your one-stop destination for brands A to Z.  So dive in, filter your favorite brands, and enjoy a shopping experience where every store feels just a click away. Don’t forget to subscribe to our newsletter for upcoming exciting offers. Happy shopping.'
        isHtml={true}
      />
    </div>
  );
};

export default AllStores;
