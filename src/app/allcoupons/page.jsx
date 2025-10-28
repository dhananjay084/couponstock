"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from "@/components/Minor/Banner";
import TextLink from "@/components/Minor/TextLink";
import Coupons_Deals from "@/components/cards/Coupons_Deals";
import ReviewCard from "@/components/cards/ReviewCard";
import HeadingText from "@/components/Minor/HeadingText";
import { getDeals } from "@/redux/deal/dealSlice";
import { fetchReviews } from "@/redux/review/reviewSlice";
import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";
import { toast } from "react-toastify";
import AjioBanner from '../../assets/AjioBanner.png'
import {fetchCountries} from "../../redux/country/countrySlice"
const AllCoupons = () => {
  const dispatch = useDispatch();

  const { deals = [] } = useSelector((state) => state.deal || { deals: [] });
  const { reviews = [] } = useSelector((state) => state.reviews || { reviews: [] });
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
  const data = homeAdmin.data?.[0] || {};
  const { countries = [] } = useSelector((state) => state.country || { countries: [] });
  const [selectedCountries, setSelectedCountries] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef();
  // useEffect(() => {
  //   dispatch(getDeals());
  //   dispatch(fetchReviews());
  //   dispatch(getHomeAdminData());
  // }, [dispatch]);

  useEffect(() => {
  const fetchData = async () => {
    dispatch(fetchCountries());

    try {
      await dispatch(getDeals()).unwrap();
      // toast.success("Deals loaded successfully!");
    } catch (err) {
      // toast.error("Failed to load deals");
    }

    try {
      await dispatch(fetchReviews()).unwrap();
      // toast.success("Reviews loaded successfully!");
    } catch (err) {
      toast.error("Failed to load reviews");
    }

    try {
      await dispatch(getHomeAdminData()).unwrap();
      // toast.success("Home data loaded successfully!");
    } catch (err) {
      toast.error("Failed to load home page data");
    }
  };

  fetchData();
}, [dispatch]);





  // Current date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter expired deals
  const expiredDeals = deals.filter((deal) => {
    const expiry = new Date(deal.expiredDate);
    expiry.setHours(0, 0, 0, 0);
    return expiry < today;
  });

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

const filteredExpiredDeals = selectedCountries.length
  ? expiredDeals.filter((deal) =>
      Array.isArray(deal.country)
        ? deal.country.some((c) => selectedCountries.includes(c))
        : selectedCountries.includes(deal.country)
    )
  : expiredDeals;


useEffect(() => {
  if (activeDeals.length === 0) toast.info("No active deals available.");
  if (expiredDeals.length === 0) toast.info("No expired deals found.");
  if (reviews.length === 0) toast.info("No user reviews yet.");
}, [activeDeals, expiredDeals, reviews]);
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
        <h1 className="font-semibold text-xl max-w-[80%] px-4">
          ALL DEALS & COUPONS CODES
        </h1>

        <Banner text="" colorText="" BgImage={AjioBanner} link= 'https://www.ajio.com/' />
        <div className="flex justify-between items-center flex-wrap gap-3">
  <TextLink text="All" colorText="Offers" link="" linkText="" />

  {/* Country Select Search Dropdown */}
  <div className="relative w-full sm:w-80" ref={dropdownRef}>
    {/* Input with pills */}
    <div
      className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white cursor-text overflow-x-auto scrollbar-hide whitespace-nowrap"
      onClick={() => setIsDropdownOpen(true)}
      style={{ maxHeight: "44px" }} // Fixed height
    >
      {selectedCountries.map((country) => (
        <span
          key={country}
          className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm shrink-0"
        >
          {country}
          <button
            type="button"
            className="ml-2 text-blue-600 hover:text-blue-800"
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
        placeholder={selectedCountries.length ? "" : "Search countries..."}
        className="flex-1 outline-none text-sm bg-transparent min-w-[80px]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
      />
    </div>

    {/* Dropdown */}
    {isDropdownOpen && (
      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-20">
        {countries
          .filter((c) =>
            c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((country) => (
            <div
              key={country._id}
              onClick={() => {
                if (!selectedCountries.includes(country.country_name)) {
                  setSelectedCountries((prev) => [...prev, country.country_name]);
                }
                setSearchTerm("");
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
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
</div>
{/* Active Deals */}
<div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around max-h-[500px] overflow-y-auto">
  {filteredActiveDeals.length > 0 ? (
    filteredActiveDeals.map((deal) => (
      <Coupons_Deals key={deal._id} data={deal} border={true} />
    ))
  ) : (
    <p className="text-sm text-gray-500 px-4">No active coupons found.</p>
  )}
</div>

{/* Expired Deals */}
<TextLink text="Expired" colorText="Coupons" link="" linkText="" />
<div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around max-h-[500px] overflow-y-auto">
  {filteredExpiredDeals.length > 0 ? (
    filteredExpiredDeals.slice(0, 3).map((deal) => (
      <Coupons_Deals
        key={deal._id}
        data={deal}
        border={true}
        disabled={true}
      />
    ))
  ) : (
    <p className="text-sm text-gray-500 px-4">No expired coupons found.</p>
  )}
</div>



        <TextLink text="User" colorText="Review" link="" linkText="" />
        <div className="p-4 flex gap-4 overflow-x-scroll">
          {reviews.length > 0 ? (
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
