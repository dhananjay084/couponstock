"use client";

import { useEffect, useState } from "react";
import Banner from "@/components/Minor/Banner";
import BannerCard from "@/components/cards/BannerCards";
import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";
import { useSelector, useDispatch } from "react-redux";
import TextLink from "@/components/Minor/TextLink";
import { getDeals } from "@/redux/deal/dealSlice";
import DealCard from "@/components/cards/DealCard";
import DesktopCard from "@/components/cards/DealsDesktopCard";
import { getStores } from "../redux/store/storeSlice";
import BrandCard from "@/components/cards/BrandCard";
import DesktopStoreCard from '@/components/cards/DesktopStoreCard';
import CategoryCard from "@/components/cards/CategoryCard";
import PopularBrandCard from "@/components/cards/PopularBrandCard";
import { getCategories } from "../redux/category/categorySlice";
import PopularStores from "@/components/cards/PopularStores";
import Coupons_Deals from "@/components/cards/Coupons_Deals";
import FeaturedPost from "@/components/cards/FeaturedPost";
import ReviewCard from "@/components/cards/ReviewCard";
import NewsLetter from '@/components/Minor/NewsLetter';
import { fetchReviews } from "../redux/review/reviewSlice.js";
import { fetchBlogs } from "../redux/blog/blogSlice";
import DealOfWeek from "@/components/cards/DealOfWeek";
import FAQ from '@/components/Minor/Faq'
import { toast } from "react-toastify";


 function Home() {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal);
  const { stores = [] } = useSelector((state) => state.store);
  const { categories = [] } = useSelector((state) => state.category);
  const { reviews = [] } = useSelector((state) => state.reviews);
  const { blogs = [],  } = useSelector((state) => state.blogs || {});
   const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
    const data = homeAdmin.data?.[0] || {};


    const { error: dealError } = useSelector((state) => state.deal);
const { error: storeError } = useSelector((state) => state.store);
const { error: categoryError } = useSelector((state) => state.category);
const { error: reviewError } = useSelector((state) => state.reviews);
const { error: blogError } = useSelector((state) => state.blogs);
const { error: homeError } = useSelector((state) => state.homeAdmin);



  // Safe filter function to avoid errors
  const safeFilter = (arr, callback) => Array.isArray(arr) ? arr.filter(callback) : [];

  useEffect(() => {
 
        // Wait for deals data
         dispatch(getDeals());
         dispatch(getStores());
         dispatch(getCategories());
         dispatch(fetchReviews());
         dispatch(fetchBlogs());
         dispatch(getHomeAdminData());

  }, [dispatch]);

  


  useEffect(() => {
  if (dealError) toast.error("Failed to load deals!");
  if (storeError) toast.error("Failed to load stores!");
  if (categoryError) toast.error("Failed to load categories!");
  if (reviewError) toast.error("Failed to load reviews!");
  if (blogError) toast.error("Failed to load blogs!");
  if (homeError) toast.error("Failed to load homepage data!");
}, [dealError, storeError, categoryError, reviewError, blogError, homeError]);

  return (
    <>
      {/* Mobile Banner */}
      <div className="lg:hidden">
        <Banner
          Text="Every day we the most interesting things"
          ColorText="discuss"
          BgImage={data.homepageBanner || ""}
        />
      </div>

      {/* Desktop Banner Cards */}
      <div className="lg:flex flex-wrap gap-4 p-4 justify-center lg:justify-between hidden">
        {Array.isArray(data.bannerDeals) && data.bannerDeals.length > 0 ? (
          data.bannerDeals.map((deal) => (
            <div className="w-full sm:w-[48%] lg:w-[32%]" key={deal._id}>
              <BannerCard data={deal} />
            </div>
          ))
        ) : (
          <div className="text-center w-full">No deals available</div>
        )}
      </div>

      {/* TextLink */}
      <TextLink
        text="Today's Top"
        colorText="Deals"
        link="/allcoupons"
        linkText="View All"
      />

      {/* Desktop Top Deals */}
      <div className="md:flex overflow-x-scroll gap-4 px-4 hidden">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Today's Top Deal" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DesktopCard key={deal._id} data={deal} />
        ))}
      </div>

      {/* Mobile Top Deals */}
      <div className="flex overflow-x-scroll gap-4 md:hidden">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Today's Top Deal" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealCard key={deal._id} data={deal} />
        ))}
      </div>

      <TextLink text="Brands" colorText="" link="/allstores" linkText="View All" />
      <div className="flex overflow-x-scroll md:hidden">
        {safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Brands").map((store) => (
          <BrandCard key={store._id} data={store} />
        ))}
      </div>
      <div className="md:flex overflow-x-scroll hidden px-4 gap-4">
        {safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Brands").map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </div>
      <TextLink text="Popular Categories" colorText="" link="/allcategories" linkText="View All" />
      <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-10">
        {Array.isArray(categories) && categories.length > 0 ? (
          safeFilter(categories, (cat) => cat?.showOnHomepage).map((cat) => (
            <CategoryCard key={cat._id} data={cat} />
          ))
        ) : (
          <p className="text-center w-full">No categories found.</p>
        )}
      </div>

      {/* Popular Brands */}
      <TextLink text="Popular" colorText="Brands" link="/allstores" linkText="View All" />
      <div className="flex overflow-x-auto space-x-4 p-4 pt-0 scrollbar-hide md:hidden">
        {safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular").map((store) => (
          <PopularBrandCard key={store._id} data={store} />
        ))}
      </div>
      <div className="md:flex overflow-x-auto space-x-4 p-4 pt-0 scrollbar-hide hidden px-4">
        {safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular").map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </div>
      <div className="hidden md:block">
        <Banner
          Text="Every day we the most interesting things"
          ColorText="discuss"
          BgImage={data.midHomepageBanner}
        />
      </div>

      {/* Hot Deals */}
      <TextLink text="Hot" colorText="Deals" link="/allcoupons" linkText="View All" />
      <div className="flex overflow-x-scroll md:hidden">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Hot" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealCard key={deal._id} data={deal} />
        ))}
      </div>
      <div className="md:flex overflow-x-scroll gap-4 hidden px-4">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Hot" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DesktopCard key={deal._id} data={deal} />
        ))}
      </div>
      <TextLink text="Popular" colorText="Stores" link="/allstores" linkText="View All" />
      <div className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
        {safeFilter(stores, (store) =>
          store?.showOnHomepage && store?.storeType === "Popular Store"
        ).map((store) => (
          <PopularStores key={store._id} data={store} />
        ))}
      </div>

      {/* Coupons & Deals */}
      <TextLink text="Coupons" colorText="& Deals" link="/allcoupons" linkText="View All" />
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Coupons/Deals" &&
          deal?.dealCategory === "coupon"
        ).map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} />
        ))}
      </div>
      <div className="md:flex md:justify-around md:items-center">
        <div className="md:w-1/2">
          <NewsLetter />
        </div>
        <div className="md:w-1/2">
          <TextLink text="Featured" colorText="Post" link="" linkText="" />
          {safeFilter(blogs, (blog) => blog?.featuredPost).map((blog) => (
            <FeaturedPost key={blog._id} blog={blog} />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
      <TextLink text="Deal of the " colorText="Week" link="/allcoupons" linkText="View All" />
      <div className="flex overflow-x-scroll gap-4 px-4">
        {safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Deal of week" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealOfWeek key={deal._id} data={deal} />
        ))}
      </div>

      <FAQ data={data.faqs} />
    </>
  );
}


export default Home;