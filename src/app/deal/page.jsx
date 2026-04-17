"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from "../../components/Minor/Banner";
import TextLink from "../../components/Minor/TextLink";
import Coupons_Deals from "../../components/cards/Coupons_Deals";
import HeadingText from "../../components/Minor/HeadingText";
import { getDeals } from "../../redux/deal/dealSlice";
import { getHomeAdminData } from "../../redux/admin/homeAdminSlice";
import { getStores } from "../../redux/store/storeSlice";
import { getCategories } from "../../redux/category/categorySlice";
import { toast } from "react-toastify";
import AjioBanner from '../../assets/AjioBanner.png'
import { fetchCountries, setSelectedCountry } from "../../redux/country/countrySlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import BannerCard from "../../components/cards/BannerCards";
import { GridSkeleton, RowSkeleton } from "../../components/skeletons/InlineSkeletons";
import { useRouter } from "next/navigation";
import { slugify } from "../../lib/slugify";
import { addCountryPrefix } from "../../lib/countryPath";

const AllCoupons = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });
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
  const countryHeading = React.useMemo(() => {
    if (!selectedCountry) return "";
    const label = String(selectedCountry || "").trim();
    if (!label) return "";
    const needsApostropheOnly = /s$/i.test(label);
    return needsApostropheOnly ? `${label}'` : `${label}'s`;
  }, [selectedCountry]);
  const { stores = [] } = useSelector((state) => state.store || { stores: [] });
  const { categories = [] } = useSelector((state) => state.category || { categories: [] });
  const [selectedCountries, setSelectedCountries] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [offerTab, setOfferTab] = React.useState("all");
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = React.useState(1);
  const dropdownRef = React.useRef();
  useEffect(() => {
  const fetchData = async () => {
    dispatch(fetchCountries());
    if (selectedCountry) {
      dispatch(getDeals(selectedCountry));
      dispatch(getHomeAdminData(selectedCountry));
      dispatch(getStores(selectedCountry));
    }
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

  const couponOffers = filteredActiveDeals.filter((deal) => deal?.dealCategory === "coupon");
  const dealOffers = filteredActiveDeals.filter((deal) => deal?.dealCategory === "deal");
  const tabbedOffers =
    offerTab === "coupon" ? couponOffers : offerTab === "deal" ? dealOffers : filteredActiveDeals;

  useEffect(() => {
    setCurrentPage(1);
  }, [offerTab, selectedCountries]);

  const totalPages = React.useMemo(() => {
    const next = Math.ceil(tabbedOffers.length / ITEMS_PER_PAGE);
    return next > 0 ? next : 1;
  }, [ITEMS_PER_PAGE, tabbedOffers.length]);

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const pagedOffers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tabbedOffers.slice(start, start + ITEMS_PER_PAGE);
  }, [ITEMS_PER_PAGE, currentPage, tabbedOffers]);

  const pageButtons = React.useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = new Set([1, totalPages]);
    for (let p = currentPage - 2; p <= currentPage + 2; p += 1) {
      if (p >= 1 && p <= totalPages) pages.add(p);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const showingFrom = tabbedOffers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, tabbedOffers.length);




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
      <main className="site-shell px-2 pb-10">
	      <section className="mx-2 mt-4 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
	        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
	          {countryHeading ? `${countryHeading} ` : ""}All Deals & Coupon Codes
	        </h1>
	        <p className="mt-2 max-w-2xl text-sm text-white/85">
	          Browse active offers from verified stores and filter instantly by country, store, or category.
	        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {filteredActiveDeals.length} Active Offers
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {stores.length} Stores
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            {categories.length} Categories
          </span>
        </div>
      </section>

        {/* <Banner text="" colorText="" BgImage={AjioBanner} link= 'https://www.ajio.com/' /> */}
        <div className="mt-6 lg:hidden px-2 pb-4">
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
      <div className="hidden flex-wrap justify-center gap-4 p-4 lg:flex lg:justify-between">
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
	        <div className="my-4 w-full px-4 md:px-8">
	          <div className="pro-card flex flex-col gap-4 rounded-2xl border border-[#E4D8FF] bg-gradient-to-br from-[#F7F4FF] to-white p-5 shadow-sm">
	            <div className="flex items-start justify-between flex-wrap gap-3">
	              <TextLink text="All" colorText="Offers" link="" linkText="" noSectionWrap />
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
                    router.push(addCountryPrefix(`/deal/store/${encodeURIComponent(slugify(value))}`, selectedCountry || ""));
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
                    router.push(addCountryPrefix(`/deal/category/${encodeURIComponent(slugify(value))}`, selectedCountry || ""));
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
        <div className="w-full px-4 md:px-8">
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-[#E4D8FF] bg-white/70 p-1 shadow-sm">
            {[
              { key: "all", label: `All (${filteredActiveDeals.length})` },
              { key: "coupon", label: `Coupons (${couponOffers.length})` },
              { key: "deal", label: `Deals (${dealOffers.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setOfferTab(tab.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  offerTab === tab.key
                    ? "bg-[#5B3CC4] text-white shadow"
                    : "text-[#4A3C6A] hover:bg-[#F2EBFF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
{/* Active Deals */}
<div className="mt-4 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 lg:grid-cols-3">
  {dealsLoading && filteredActiveDeals.length === 0 ? (
    <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
  ) : pagedOffers.length > 0 ? (
    pagedOffers.map((deal) => (
      <Coupons_Deals key={deal._id} data={deal} border={true} />
    ))
  ) : (
    <p className="text-sm text-gray-500 px-4">
      {offerTab === "coupon" ? "No active coupons found." : offerTab === "deal" ? "No active deals found." : "No active offers found."}
    </p>
  )}
</div>

        {tabbedOffers.length > 0 && (
          <div className="mt-6 px-4">
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E4D8FF] bg-white/80 px-4 py-3 shadow-sm sm:flex-row">
              <p className="text-xs font-semibold text-[#4A3C6A]">
                Showing {showingFrom}-{showingTo} of {tabbedOffers.length}
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

      <HeadingText
        title={data.allCouponsAboutHeading}
        content={data.allCouponsAboutDescription || ""}
        isHtml={true}
      />
      </main>
    </>
  );
};

export default AllCoupons;
