"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from "../../components/Minor/Banner";
import TextLink from "../../components/Minor/TextLink";
import Coupons_Deals from "../../components/cards/Coupons_Deals";
import ReviewCard from "../../components/cards/ReviewCard";
import HeadingText from "../../components/Minor/HeadingText";
import { getDeals } from "../../redux/deal/dealSlice";
import { fetchReviews } from "../../redux/review/reviewSlice";
import { getHomeAdminData } from "../../redux/admin/homeAdminSlice";
import { getStores } from "../../redux/store/storeSlice";
import { getCategories } from "../../redux/category/categorySlice";
import { toast } from "react-toastify";
import AjioBanner from '../../assets/AjioBanner.png'
import { fetchCountries, setSelectedCountry } from "../../redux/country/countrySlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import BannerCard from "../../components/cards/BannerCards";
import { GridSkeleton, RowSkeleton } from "../../components/skeletons/InlineSkeletons";
import { useRouter } from "next/navigation";
import { slugify } from "../../lib/slugify";

const AllCoupons = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });
  const { reviews = [], loading: reviewsLoading } = useSelector((state) => state.reviews || { reviews: [], loading: false });
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const data = homeAdmin.data?.[0] || {};
  const pageBannerDeals =
    Array.isArray(data.dealPageBannerDeals) && data.dealPageBannerDeals.length > 0
      ? data.dealPageBannerDeals
      : Array.isArray(data.listingBannerDeals) && data.listingBannerDeals.length > 0
        ? data.listingBannerDeals
        : data.bannerDeals;
  const { countries = [], loading: countriesLoading } = useSelector((state) => state.country || { countries: [], loading: false });
  const { selectedCountry } = useSelector((state) => state.country || {});
  const { stores = [] } = useSelector((state) => state.store || { stores: [] });
  const { categories = [] } = useSelector((state) => state.category || { categories: [] });
  const [selectedCountries, setSelectedCountries] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef();
  useEffect(() => {
  const fetchData = async () => {
    dispatch(fetchCountries());
    if (selectedCountry) {
      dispatch(getDeals(selectedCountry));
      dispatch(getHomeAdminData(selectedCountry));
      dispatch(getStores(selectedCountry));
    }
    dispatch(fetchReviews());
    dispatch(getCategories());
  };

  fetchData();
}, [dispatch, selectedCountry]);

  useEffect(() => {
    if (!selectedCountry) return;
    setSelectedCountries([selectedCountry]);
  }, [selectedCountry]);





  // Current date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter active deals
  const activeDeals = deals.filter((deal) => {
    const expiry = new Date(deal.expiredDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry >= today;
  });

  // Filter deals by selected countries
// ✅ Works even if deal.country is an array
const filteredActiveDeals = selectedCountries.length
  ? activeDeals.filter((deal) =>
      Array.isArray(deal.country)
        ? deal.country.some((c) => selectedCountries.includes(c))
        : selectedCountries.includes(deal.country)
    )
  : activeDeals;




useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <>
      <div>
      <h1 className="px-4 mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight 
text-[#592EA9] drop-shadow-sm flex items-center gap-2">
  ALL DEALS 
  <span className="text-[#222] font-semibold">& COUPON CODES</span>
</h1>

        {/* <Banner text="" colorText="" BgImage={AjioBanner} link= 'https://www.ajio.com/' /> */}
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
        0: { slidesPerView: 1 },      // 0–499px → 1 card
        500: { slidesPerView: 2 },    // 500–1023px → 2 cards
        1024: { slidesPerView: 1 },   // 1024+ → grid handles layout
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



      {/* Desktop Banner Cards */}
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
        <div className="w-full px-4 md:px-8 my-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#E4D8FF] bg-gradient-to-br from-[#F7F4FF] to-white p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TextLink text="All" colorText="Offers" link="" linkText="" />
              <span className="text-xs font-medium tracking-wide text-[#6B5B95]">
                Filter by store, category or country
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Store Select Dropdown */}
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-[#4A3C6A]">Store</span>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;
                    router.push(`/deal/store/${encodeURIComponent(slugify(value))}`);
                  }}
                  className="w-full border border-[#D9CCF5] rounded-lg px-3 py-2 bg-white text-sm text-[#2b1c4d] focus:outline-none focus:ring-2 focus:ring-[#592EA9]/30"
                  defaultValue=""
                >
                  <option value="" disabled>Choose store</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s.storeName}>
                      {s.storeName}
                    </option>
                  ))}
                </select>
              </label>

              {/* Category Select Dropdown */}
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-[#4A3C6A]">Category</span>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;
                    router.push(`/deal/category/${encodeURIComponent(slugify(value))}`);
                  }}
                  className="w-full border border-[#D9CCF5] rounded-lg px-3 py-2 bg-white text-sm text-[#2b1c4d] focus:outline-none focus:ring-2 focus:ring-[#592EA9]/30"
                  defaultValue=""
                >
                  <option value="" disabled>Choose category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Country Select Search Dropdown */}
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-[#4A3C6A]">Country</span>
                <div className="relative w-full" ref={dropdownRef}>
                  <div
                    className="flex items-center gap-2 border border-[#D9CCF5] rounded-lg px-3 py-2 bg-white cursor-text overflow-x-auto scrollbar-hide whitespace-nowrap focus-within:ring-2 focus-within:ring-[#592EA9]/30"
                    onClick={() => setIsDropdownOpen(true)}
                    style={{ maxHeight: "44px" }}
                  >
                    {selectedCountries.map((country) => (
                      <span
                        key={country}
                        className="inline-flex items-center bg-[#EEE6FF] text-[#4B1F86] px-2 py-1 rounded-full text-xs shrink-0"
                      >
                        {country}
                        <button
                          type="button"
                          className="ml-2 text-[#4B1F86] hover:text-[#3a146d]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountries((prev) => prev.filter((c) => c !== country));
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder={selectedCountries.length ? "" : "Search country..."}
                      className="flex-1 outline-none text-sm bg-transparent min-w-[80px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-20">
                      {(countriesLoading && countries.length === 0) ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Loading countries...</div>
                      ) : countries
                        .filter((c) =>
                          c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((country) => (
                          <div
                            key={country._id}
                            onClick={() => {
                              const name = country.country_name;
                              setSelectedCountries([name]);
                              dispatch(setSelectedCountry(name));
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                              router.push(`/country/${encodeURIComponent(slugify(name))}`);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-[#F5F1FF]"
                          >
                            {country.country_name}
                          </div>
                        ))}

                      {countries.filter((c) =>
                        c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No countries found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
{/* Active Deals */}
<div className=" mt-4 space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around max-h-[500px] overflow-y-auto">
  {dealsLoading && filteredActiveDeals.length === 0 ? (
    <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
  ) : filteredActiveDeals.length > 0 ? (
    filteredActiveDeals.map((deal) => (
      <Coupons_Deals key={deal._id} data={deal} border={true} />
    ))
  ) : (
    <p className="text-sm text-gray-500 px-4">No active coupons found.</p>
  )}
</div>

        <TextLink text="User" colorText="Review" link="" linkText="" />
        <div className="p-4 flex gap-4 overflow-x-scroll">
          {reviewsLoading && reviews.length === 0 ? (
            <RowSkeleton count={3} />
          ) : reviews.length > 0 ? (
            reviews.map((review) => <ReviewCard key={review._id} data={review} />)
          ) : (
            <p className="text-sm text-gray-500">No reviews found.</p>
          )}
        </div>
      </div>

      <HeadingText
        title={data.allCouponsAboutHeading}
        content='This page contains all the brands that you can think of, from popular Indian names to leading international labels. This page is designed to make your shopping journey seamless and stress-free. Here, we’ve listed a wide range of stores covering almost every category you could want. Whether you’re on the hunt for a stylish dress from your favorite fashion brand, planning to book luxury airline tickets at a discount, or looking for the best deals on furniture, electronics, beauty products, or groceries, you’ll find it all right here.
To make things even easier, we’ve added a filter option so you can quickly search and discover the exact brand you’re looking for in just seconds. No endless scrolling, no wasted time just straight to the savings. This page is truly your one-stop destination for brands A to Z.  So dive in, filter your favorite brands, and enjoy a shopping experience where every store feels just a click away. Don’t forget to subscribe to our newsletter for upcoming exciting offers. Happy shopping.'
        isHtml={true}
      />
    </>
  );
};

export default AllCoupons;
