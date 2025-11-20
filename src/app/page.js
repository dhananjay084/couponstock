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
import NumberStats from "@/components/numbers/number";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import PriceLineBanner from "@/assets/PriceLine.png";
import PriceLineMobile from "@/assets/PricelineMobile.png"

 function Home() {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal);
  const { stores = [] } = useSelector((state) => state.store);
  const { categories = [] } = useSelector((state) => state.category);
  const { reviews = [] } = useSelector((state) => state.reviews);
  const { blogs = [],  } = useSelector((state) => state.blogs || {});
   const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
   console.log("homeAdmin",homeAdmin)
    const data = homeAdmin.data?.[0] || {};
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

  const stats = [
    { number: "200+", label: "Happy Clients" },
    { number: "500+", label: "Brands" },
    { number: "1M+", label: "Users" },
    { number: "60+", label: "Countries" },
  ];
  const demoData = [
    {
      category: "MOBILES",
      links: [
        { text: "iPhone 17", href: "#" },
        { text: "Samsung Galaxy S25", href: "#" },
        { text: "Redmi Note 14", href: "#" },
        { text: "OnePlus Nord", href: "#" },
      ],
    },
    {
      category: "CAMERAS",
      links: [
        { text: "Canon DSLR", href: "#" },
        { text: "Nikon DSLR", href: "#" },
        { text: "Sony Camera", href: "#" },
        { text: "GoPro", href: "#" },
      ],
    },
    {
      category: "LAPTOPS",
      links: [
        { text: "MacBook Pro", href: "#" },
        { text: "Asus ROG", href: "#" },
        { text: "HP Laptops", href: "#" },
        { text: "Dell Laptops", href: "#" },
      ],
    },
    {
      category: "CLOTHING",
      links: [
        { text: "Men's Jeans", href: "#" },
        { text: "Sarees", href: "#" },
        { text: "Shirts", href: "#" },
        { text: "Kurti", href: "#" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Banner */}
    {/* ✅ Mobile Banner Slider */}
{/* ✅ Mobile Banner Slider */}
<div className="lg:hidden px-2 pb-4">
  {Array.isArray(data.bannerDeals) && data.bannerDeals.length > 0 ? (
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
      {data.bannerDeals.map((deal) => (
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

      <TextLink
        text="Today's Top"
        colorText="Deals"
        link="/allcoupons"
        linkText="View All"
      />

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
      <main className=" flex flex-col justify-center items-center bg-white">
  
      <NumberStats stats={stats} />
    </main>
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
      <TextLink
  text="Popular Categories"
  colorText=""
  link="/allcategories"
  linkText="View All"
/>

<div className="px-4 mb-10 overflow-x-auto">
  <div className="flex gap-4 w-max py-2">
    {Array.isArray(categories) && categories.length > 0 ? (
      safeFilter(categories, (cat) => cat?.showOnHomepage).map((cat) => (
        <div key={cat._id} className="w-28 flex-shrink-0"> {/* 👈 fixed card width */}
          <CategoryCard data={cat} />
        </div>
      ))
    ) : (
      <p className="text-center w-full">No categories found.</p>
    )}
  </div>
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

      <div className="hidden lg:block">
        <Banner
          Text=""
          ColorText=""
          BgImage={PriceLineBanner}
          link="https://www.priceline.com/"
        />
      </div>
      <div className="block lg:hidden">
        <Banner
          Text=""
          ColorText=""
          BgImage={PriceLineMobile}
          link="https://www.priceline.com/"
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
          <Coupons_Deals key={deal._id} data={deal} border={true} />
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
      {/* <BrandDirectory heading="Top Stories : Brand Directory" data={demoData} /> */}

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