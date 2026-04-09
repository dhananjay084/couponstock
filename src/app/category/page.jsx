"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from "../../components/Minor/Banner";
import TextLink from "../../components/Minor/TextLink";
import CategoryCard from "../../components/cards/CategoryCard";
import HeadingText from "../../components/Minor/HeadingText";
import { getCategories } from "../../redux/category/categorySlice";
import { getHomeAdminData } from "../../redux/admin/homeAdminSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import BannerCard from "../../components/cards/BannerCards";
import { GridSkeleton, RowSkeleton } from "../../components/skeletons/InlineSkeletons";

const AllCategories = () => {
  const dispatch = useDispatch();

  const { categories = [], loading } = useSelector((state) => state.category);
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const { selectedCountry } = useSelector((state) => state.country || {});
  const data = (homeAdmin.data && homeAdmin.data[0]) || {};
  const pageBannerDeals =
    Array.isArray(data.categoryPageBannerDeals) && data.categoryPageBannerDeals.length > 0
      ? data.categoryPageBannerDeals
      : Array.isArray(data.listingBannerDeals) && data.listingBannerDeals.length > 0
        ? data.listingBannerDeals
        : data.bannerDeals;
  const [selectedLetter, setSelectedLetter] = useState("All");

  const alphabet = useMemo(
    () => ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))],
    []
  );

  const filteredCategories = useMemo(() => {
    if (selectedLetter === "All") return categories;
    return categories.filter((cat) =>
      cat.name?.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  }, [categories, selectedLetter]);

  useEffect(() => {
    dispatch(getCategories());
    if (selectedCountry) {
      dispatch(getHomeAdminData(selectedCountry));
    }
  }, [dispatch, selectedCountry]);

  return (
    <div className="overflow-x-hidden">
      <section className="mx-2 mt-4 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          All Categories
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          Browse coupon and deal categories to quickly discover offers for travel, fashion, food, tech, and more.
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

      <TextLink text="Popular Categories" colorText="" link="" linkText="" />
      <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {loading && categories.length === 0 ? (
          <GridSkeleton count={16} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4 col-span-full" itemClassName="h-24 rounded-lg bg-gray-200" />
        ) : categories.length > 0 ? (
          categories
            .filter((cat) => cat.popularStore)
            .map((cat) => <CategoryCard key={cat._id} data={cat} />)
        ) : (
          <p className="text-center w-full">No popular categories found.</p>
        )}
      </div>

      <TextLink text="All Categories" colorText="" link="" linkText="" />
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
      <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => <CategoryCard key={cat._id} data={cat} />)
        ) : (
          <p className="text-center w-full col-span-full">
            {loading ? "Loading categories..." : "No categories found."}
          </p>
        )}
      </div>

      <HeadingText
        title={data.allCategoriesAboutHeading}
        content={data.allCategoriesAboutDescription || ""}
        isHtml={true}
      />
    </div>
  );
};

export default AllCategories;
