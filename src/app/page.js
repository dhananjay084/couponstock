"use client";

import { useEffect, useRef, useState } from "react";
import Banner from "../components/Minor/Banner";
import BannerCard from "../components/cards/BannerCards";
import { getHomeAdminData } from "../redux/admin/homeAdminSlice";
import { useSelector, useDispatch } from "react-redux";
import TextLink from "../components/Minor/TextLink";
import { getDeals } from "../redux/deal/dealSlice";
import DealCard from "../components/cards/DealCard";
import DesktopCard from "../components/cards/DealsDesktopCard";
import { getStores } from "../redux/store/storeSlice";
import BrandCard from "../components/cards/BrandCard";
import DesktopStoreCard from '../components/cards/DesktopStoreCard';
import CategoryCard from "../components/cards/CategoryCard";
import PopularBrandCard from "../components/cards/PopularBrandCard";
import { getCategories } from "../redux/category/categorySlice";
import PopularStores from "../components/cards/PopularStores";
import Coupons_Deals from "../components/cards/Coupons_Deals";
import FeaturedPost from "../components/cards/FeaturedPost";
import BlogCard from "../components/cards/BlogCard";
import ReviewCard from "../components/cards/ReviewCard";
import NewsLetter from '../components/Minor/NewsLetter';
import { fetchReviews } from "../redux/review/reviewSlice.js";
import { fetchBlogs } from "../redux/blog/blogSlice";
import DealOfWeek from "../components/cards/DealOfWeek";
import FAQ from '../components/Minor/Faq'
import NumberStats from "../components/numbers/number";
import { GridSkeleton, RowSkeleton } from "../components/skeletons/InlineSkeletons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import PriceLineBanner from "../assets/PriceLine.png";
import PriceLineMobile from "../assets/PricelineMobile.png"

 function Home() {
  const dispatch = useDispatch();
  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal);
  const { stores = [], loading: storesLoading } = useSelector((state) => state.store);
  const { categories = [], loading: categoriesLoading } = useSelector((state) => state.category);
  const { reviews = [], loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { blogs = [], loading: blogsLoading } = useSelector((state) => state.blogs || {});
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const { selectedCountry } = useSelector((state) => state.country || {});
   console.log("homeAdmin",homeAdmin)
    const data = homeAdmin.data?.[0] || {};
  const safeFilter = (arr, callback) => Array.isArray(arr) ? arr.filter(callback) : [];
  const latestBlogs = Array.isArray(blogs)
    ? [...blogs].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6)
    : [];
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const featuredPrevRef = useRef(null);
  const featuredNextRef = useRef(null);

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
    dispatch(getStores(selectedCountry));
    dispatch(getCategories());
    dispatch(fetchReviews());
    dispatch(fetchBlogs());
    dispatch(getHomeAdminData(selectedCountry));
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("newsletterPopupSeen");
    if (!seen) {
      const timer = setTimeout(() => setShowNewsletterPopup(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("newsletterPopupSeen", "1");
    }
    setShowNewsletterPopup(false);
  };

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
      {showNewsletterPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full relative border border-[#E4D8FF] shadow-xl">
            <button
              onClick={closePopup}
              className="absolute top-2 right-3 text-lg font-bold text-[#592EA9] cursor-pointer"
            >
              ×
            </button>
            <NewsLetter />
          </div>
        </div>
      )}
      {/* Mobile Banner */}
    {/* ✅ Mobile Banner Slider */}
{/* ✅ Mobile Banner Slider */}
<div className="lg:hidden px-2 pb-4">
  {homeAdmin.loading ? (
    <RowSkeleton count={2} itemClassName="h-36 w-full rounded-lg bg-gray-200" />
  ) : Array.isArray(data.bannerDeals) && data.bannerDeals.length > 0 ? (
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
      <div className="hidden lg:block p-4">
        {homeAdmin.loading ? (
          <GridSkeleton count={3} className="grid grid-cols-3 gap-4 w-full" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : Array.isArray(data.bannerDeals) && data.bannerDeals.length > 0 ? (
          data.bannerDeals.length > 3 ? (
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
              {data.bannerDeals.map((deal) => (
                <SwiperSlide key={deal._id} className="flex justify-center items-center">
                  <BannerCard data={deal} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center lg:justify-between">
              {data.bannerDeals.map((deal) => (
                <div className="w-full sm:w-[48%] lg:w-[32%]" key={deal._id}>
                  <BannerCard data={deal} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center w-full">No deals available</div>
        )}
      </div>

      <TextLink
        text="Today's Top"
        colorText="Deals"
        link="/deal"
        linkText="View All"
      />

      <div className="md:flex overflow-x-scroll gap-4 px-4 hidden">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={4} />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Today's Top Deal" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DesktopCard key={deal._id} data={deal} />
        ))}
      </div>

      {/* Mobile Top Deals */}
      <div className="flex overflow-x-scroll gap-4 md:hidden">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Today's Top Deal" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealCard key={deal._id} data={deal} />
        ))}
      </div>
      <TextLink text="Brands" colorText="" link="/store" linkText="View All" />
      <div className="flex overflow-x-scroll md:hidden">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={3} />
        ) : safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Brands").map((store) => (
          <BrandCard key={store._id} data={store} />
        ))}
      </div>
      <div className="md:flex overflow-x-scroll hidden px-4 gap-4">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Brands").map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </div>
      <TextLink
  text="Popular Categories"
  colorText=""
  link="/category"
  linkText="View All"
/>

<div className="px-4 mb-10 overflow-x-auto">
  <div className="flex gap-4 w-max py-2">
    {categoriesLoading && categories.length === 0 ? (
      <GridSkeleton count={8} className="grid grid-cols-4 md:grid-cols-8 gap-3" itemClassName="h-24 rounded-lg bg-gray-200" />
    ) : Array.isArray(categories) && categories.length > 0 ? (
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
      <TextLink text="Popular" colorText="Brands" link="/store" linkText="View All" />
      <div className="flex overflow-x-auto space-x-4 p-4 pt-0 scrollbar-hide md:hidden">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={3} />
        ) : safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular").map((store) => (
          <PopularBrandCard key={store._id} data={store} />
        ))}
      </div>
      <div className="md:flex overflow-x-auto space-x-4 p-4 pt-0 scrollbar-hide hidden px-4">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular").map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </div>

      {/* Mid Homepage Banner Slider */}
      {Array.isArray(data.midHomepageBanners) && data.midHomepageBanners.length >= 3 && (
        <div className="px-4 py-6 relative">
          <div className="absolute right-6 top-2 z-10 flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous banner"
              className="mid-prev h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 bg-white/90"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next banner"
              className="mid-next h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 bg-white/90"
            >
              ›
            </button>
          </div>
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            navigation={{ prevEl: ".mid-prev", nextEl: ".mid-next" }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={10}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
          >
            {data.midHomepageBanners.map((banner, idx) => {
              const image = typeof banner === "string" ? banner : banner?.image;
              const link = typeof banner === "string" ? "" : banner?.link;
              return (
              <SwiperSlide key={`${banner}-${idx}`} className="flex justify-center items-center">
                <div className="w-full h-40 rounded-xl overflow-hidden border border-[#E4D8FF] shadow-sm">
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <img src={image} alt="Mid Banner" className="w-full h-full object-cover" />
                    </a>
                  ) : (
                    <img src={image} alt="Mid Banner" className="w-full h-full object-cover" />
                  )}
                </div>
              </SwiperSlide>
            )})}
          </Swiper>
        </div>
      )}

      {/* Hot Deals */}
      <TextLink text="Hot" colorText="Deals" link="/deal" linkText="View All" />
      <div className="flex overflow-x-scroll md:hidden">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Hot" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealCard key={deal._id} data={deal} />
        ))}
      </div>
      <div className="md:flex overflow-x-scroll gap-4 hidden px-4">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={4} />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Hot" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DesktopCard key={deal._id} data={deal} />
        ))}
      </div>
      <TextLink text="Popular" colorText="Stores" link="/store" linkText="View All" />
      <div className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : safeFilter(stores, (store) =>
          store?.showOnHomepage && store?.storeType === "Popular Store"
        ).map((store) => (
          <PopularStores key={store._id} data={store} />
        ))}
      </div>

      <main className=" flex flex-col justify-center items-center bg-white">
        <NumberStats stats={stats} />
      </main>

      {/* Coupons & Deals */}
      <TextLink text="Coupons" colorText="& Deals" link="/deal" linkText="View All" />
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && deals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Coupons/Deals" &&
          deal?.dealCategory === "coupon"
        ).map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </div>
      <div className="md:flex md:items-stretch md:gap-6">
        <div className="md:w-1/2 w-full">
          <NewsLetter />
        </div>
        <div className="md:w-1/2 w-full">
          <div className="flex items-center justify-between">
            <TextLink text="Featured" colorText="Post" link="" linkText="" />
            <div className="flex items-center gap-2 pr-4">
              <button
                type="button"
                aria-label="Previous featured post"
                ref={featuredPrevRef}
                className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next featured post"
                ref={featuredNextRef}
                className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900"
              >
                ›
              </button>
            </div>
          </div>
          <div className="w-full pb-6">
            {blogsLoading && blogs.length === 0 ? (
              <RowSkeleton count={3} />
            ) : (
              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                className="w-full"
                pagination={{ clickable: true }}
                navigation={{ prevEl: featuredPrevRef.current, nextEl: featuredNextRef.current }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = featuredPrevRef.current;
                  swiper.params.navigation.nextEl = featuredNextRef.current;
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                spaceBetween={12}
                loop
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 1 },
                }}
              >
                {safeFilter(blogs, (blog) => blog?.featuredPost).map((blog) => (
                  <SwiperSlide key={blog._id} className="w-full">
                    <FeaturedPost blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      {/* <BrandDirectory heading="Top Stories : Brand Directory" data={demoData} /> */}

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {reviewsLoading && reviews.length === 0 ? (
          <RowSkeleton count={3} />
        ) : Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
      <TextLink text="Deal of the " colorText="Week" link="/deal" linkText="View All" />
      <div className="flex overflow-x-scroll gap-4 px-4">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : safeFilter(deals, (deal) =>
          deal?.showOnHomepage &&
          deal?.dealType === "Deal of week" &&
          deal?.dealCategory === "deal"
        ).map((deal) => (
          <DealOfWeek key={deal._id} data={deal} />
        ))}
      </div>

      <FAQ data={data.faqs} imageUrl={data.faqImage} />

      {(data.homeFooterTitle || data.homeFooterDescription) && (
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-4">
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
            {data.homeFooterTitle && (
              <div className="text-lg font-extrabold text-gray-900">
                {data.homeFooterTitle}
              </div>
            )}
            {data.homeFooterDescription && (
              <div className="mt-1 text-[15px] font-medium text-gray-900">
                {data.homeFooterDescription}
              </div>
            )}
          </div>
        </div>
      )}
    
    </>
  );
}


export default Home;
