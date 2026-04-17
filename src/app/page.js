"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BannerCard from "../components/cards/BannerCards";
import { getHomeAdminData } from "../redux/admin/homeAdminSlice";
import { useSelector, useDispatch } from "react-redux";
import TextLink from "../components/Minor/TextLink";
import { getDeals } from "../redux/deal/dealSlice";
import TopDealShowcaseCard from "../components/cards/TopDealShowcaseCard";
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
import BlogCard from "../components/cards/BlogCard";
import ReviewCard from "../components/cards/ReviewCard";
import { fetchReviews } from "../redux/review/reviewSlice.js";
import { fetchBlogs } from "../redux/blog/blogSlice";
import DealOfWeek from "../components/cards/DealOfWeek";
import FAQ from '../components/Minor/Faq'
import NumberStats from "../components/numbers/number";
import { GridSkeleton, RowSkeleton } from "../components/skeletons/InlineSkeletons";
import ArrowScrollRow from "../components/Minor/ArrowScrollRow";
import CountryLink from "../components/Minor/CountryLink";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

 function Home() {
  const dispatch = useDispatch();
  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal);
  const { stores = [], loading: storesLoading } = useSelector((state) => state.store);
  const { categories = [], loading: categoriesLoading } = useSelector((state) => state.category);
  const { reviews = [], loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { blogs = [], loading: blogsLoading } = useSelector((state) => state.blogs || {});
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [], loading: false };
  const { selectedCountry } = useSelector((state) => state.country || {});
  const data = homeAdmin.data?.[0] || {};
  const safeFilter = (arr, callback) => Array.isArray(arr) ? arr.filter(callback) : [];
  const latestBlogs = Array.isArray(blogs)
    ? [...blogs].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6)
    : [];
  const latestStoriesPrevRef = useRef(null);
  const latestStoriesNextRef = useRef(null);
  const homeBannerMobilePrevRef = useRef(null);
  const homeBannerMobileNextRef = useRef(null);
  const homeBannerDesktopPrevRef = useRef(null);
  const homeBannerDesktopNextRef = useRef(null);
  const [showFullHeroDescription, setShowFullHeroDescription] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const metaTitle = data.homeMetaTitle?.trim();
  const metaDescription = data.homeMetaDescription?.trim();
  const decodeHtmlEntities = (value = "") => {
    if (!value) return "";
    if (typeof window === "undefined") return value;
    const textarea = document.createElement("textarea");
    let decoded = value;
    for (let i = 0; i < 2; i += 1) {
      textarea.innerHTML = decoded;
      const next = textarea.value;
      if (next === decoded) break;
      decoded = next;
    }
    return decoded;
  };
  const stripHtmlTags = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const trimText = (value = "", limit = 120) => {
    if (!value) return "";
    if (value.length <= limit) return value;
    return `${value.slice(0, limit).trimEnd()}...`;
  };
  const normalizeFooterHtml = (value = "") => {
    const decoded = decodeHtmlEntities(value).trim();
    if (!decoded) return "";
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(decoded);
    if (hasHtmlTags) return decoded;
    return decoded
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const handle = () => setIsMobileViewport(media.matches);
    handle();
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
    dispatch(getStores(selectedCountry));
    dispatch(getCategories());
    dispatch(fetchReviews());
    dispatch(fetchBlogs());
    dispatch(getHomeAdminData(selectedCountry));
  }, [dispatch, selectedCountry]);

  const stats = [
    { number: "200+", label: "Happy Clients" },
    { number: "500+", label: "Brands" },
    { number: "1M+", label: "Users" },
    { number: "60+", label: "Countries" },
  ];

  const storesByName = useMemo(() => {
    const map = new Map();
    for (const store of stores || []) {
      if (!store?.storeName) continue;
      map.set(String(store.storeName).toLowerCase(), store);
    }
    return map;
  }, [stores]);

  const topDeals = safeFilter(
    deals,
    (deal) => deal?.showOnHomepage && deal?.dealType === "Today's Top Deal" && deal?.dealCategory === "deal"
  );
  const hotDeals = safeFilter(
    deals,
    (deal) => deal?.showOnHomepage && deal?.dealType === "Hot" && deal?.dealCategory === "deal"
  );
  const couponDeals = safeFilter(
    deals,
    (deal) => deal?.showOnHomepage && deal?.dealType === "Coupons/Deals" && deal?.dealCategory === "coupon"
  );
  const weeklyDeals = safeFilter(
    deals,
    (deal) => deal?.showOnHomepage && deal?.dealType === "Deal of week" && deal?.dealCategory === "deal"
  );
  const brandStores = safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Brands");
  const popularBrands = safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular");
  const popularStores = safeFilter(stores, (store) => store?.showOnHomepage && store?.storeType === "Popular Store");
  const featuredBlogs = safeFilter(blogs, (blog) => blog?.featuredPost).sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const latestStoryBlogs = featuredBlogs.length > 0 ? featuredBlogs : latestBlogs;
  const homepageCategories = safeFilter(categories, (cat) => cat?.showOnHomepage);
  const heroPopularStores = (popularStores.length > 0 ? popularStores : stores).slice(0, 8);
  const heroHeading =
    trimText(stripHtmlTags(decodeHtmlEntities(data.homeFooterTitle || "")), 110) ||
    "Discover trusted coupon codes and high-converting deals in one premium destination.";
  const fullHeroDescriptionHtml =
    normalizeFooterHtml(data.homeFooterDescription || "") ||
    "<p>Save faster with curated offers, top stores, and fresh discounts across travel, fashion, food, and everyday essentials.</p>";
  const fullHeroDescriptionText = stripHtmlTags(fullHeroDescriptionHtml);
  const hasTrimmedHeroDescription = fullHeroDescriptionText.length > 230;

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (metaTitle) {
      document.title = metaTitle;
    }

    if (metaDescription) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "description");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", metaDescription);
    }
  }, [metaTitle, metaDescription]);

  return (
    <>
      <main className="site-shell pb-8">
      {/* Mobile Banner */}
    {/* ✅ Mobile Banner Slider */}
{/* ✅ Mobile Banner Slider */}
<div className="lg:hidden px-2 pb-4">
  {homeAdmin.loading ? (
    <RowSkeleton count={2} itemClassName="h-36 w-full rounded-lg bg-gray-200" />
  ) : Array.isArray(data.bannerDeals) && data.bannerDeals.length > 0 ? (
    <div className="relative">
      <div className="mb-3 flex items-center justify-end gap-2 pr-1">
        <button
          type="button"
          aria-label="Previous banner"
          ref={homeBannerMobilePrevRef}
          className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next banner"
          ref={homeBannerMobileNextRef}
          className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
        >
          ›
        </button>
      </div>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation={{ prevEl: homeBannerMobilePrevRef.current, nextEl: homeBannerMobileNextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = homeBannerMobilePrevRef.current;
          swiper.params.navigation.nextEl = homeBannerMobileNextRef.current;
        }}
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
    </div>
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
            <div className="w-full">
              <div className="mb-3 flex items-center justify-end gap-2 pr-1">
                <button
                  type="button"
                  aria-label="Previous banner"
                  ref={homeBannerDesktopPrevRef}
                  className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next banner"
                  ref={homeBannerDesktopNextRef}
                  className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                >
                  ›
                </button>
              </div>
              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                pagination={{ clickable: true }}
                navigation={{ prevEl: homeBannerDesktopPrevRef.current, nextEl: homeBannerDesktopNextRef.current }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = homeBannerDesktopPrevRef.current;
                  swiper.params.navigation.nextEl = homeBannerDesktopNextRef.current;
                }}
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
            </div>
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

      <div className="section-wrap px-4">
        {dealsLoading && deals.length === 0 ? (
          <GridSkeleton
            count={6}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="h-40 rounded-2xl bg-gray-200"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topDeals.map((deal) => (
              <TopDealShowcaseCard
                key={deal._id}
                deal={deal}
                store={storesByName.get(String(deal?.store || "").toLowerCase())}
              />
            ))}
          </div>
        )}
      </div>
      <TextLink text="Brands" colorText="" link="/store" linkText="View All" />
      <ArrowScrollRow className="md:hidden" controlsClassName="px-4" scrollerClassName="flex overflow-x-scroll">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={3} />
        ) : brandStores.map((store) => (
          <BrandCard key={store._id} data={store} />
        ))}
      </ArrowScrollRow>
      <ArrowScrollRow className="hidden md:block" controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : brandStores.map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </ArrowScrollRow>
<TextLink
  text="Popular Categories"
  colorText=""
  link="/category"
  linkText="View All"
/>

<div className="mb-10 px-4">
  {categoriesLoading && categories.length === 0 ? (
    <GridSkeleton
      count={8}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      itemClassName="h-24 rounded-lg bg-gray-200"
    />
  ) : Array.isArray(categories) && categories.length > 0 ? (
    <div className="-mx-2 flex flex-wrap py-2">
      {homepageCategories.map((cat) => (
        <div key={cat._id} className="w-1/2 px-2 pb-4 sm:w-1/3 md:w-1/4 lg:w-1/6">
          <CategoryCard data={cat} />
        </div>
      ))}
    </div>
  ) : (
    <p className="w-full text-center">No categories found.</p>
  )}
</div>

      {/* Popular Brands */}
      <TextLink text="Popular" colorText="Brands" link="/store" linkText="View All" />
      <ArrowScrollRow className="md:hidden" controlsClassName="px-4" scrollerClassName="flex space-x-4 overflow-x-auto p-4 pt-0 scrollbar-hide">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={3} />
        ) : popularBrands.map((store) => (
          <PopularBrandCard key={store._id} data={store} />
        ))}
      </ArrowScrollRow>
      <ArrowScrollRow className="hidden md:block" controlsClassName="px-4" scrollerClassName="flex space-x-4 overflow-x-auto p-4 pt-0 scrollbar-hide px-4">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : popularBrands.map((store) => (
          <DesktopStoreCard key={store._id} data={store} />
        ))}
      </ArrowScrollRow>

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
              const image =
                typeof banner === "string"
                  ? banner
                  : isMobileViewport && banner?.imageMobile
                    ? banner.imageMobile
                    : banner?.image;
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
      <ArrowScrollRow className="md:hidden" controlsClassName="px-4" scrollerClassName="flex overflow-x-scroll">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : hotDeals.map((deal) => (
          <DealCard key={deal._id} data={deal} />
        ))}
      </ArrowScrollRow>
      <ArrowScrollRow className="hidden md:block" controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={4} />
        ) : hotDeals.map((deal) => (
          <DesktopCard key={deal._id} data={deal} />
        ))}
      </ArrowScrollRow>
      <TextLink text="Popular" colorText="Stores" link="/store" linkText="View All" />
      <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
        {storesLoading && stores.length === 0 ? (
          <RowSkeleton count={4} />
        ) : popularStores.map((store) => (
          <PopularStores key={store._id} data={store} />
        ))}
      </ArrowScrollRow>

      <div className="flex flex-col items-center justify-center">
        <NumberStats stats={stats} />
      </div>

      {/* Coupons & Deals */}
      <TextLink text="Coupons" colorText="& Deals" link="/deal" linkText="View All" />
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && deals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : couponDeals.map((deal) => (
          <Coupons_Deals key={deal._id} data={deal} border={true} />
        ))}
      </div>
      <section className="section-wrap section-block rounded-3xl border border-[#E4EAF3] bg-white p-4 shadow-[0_10px_25px_rgba(16,24,40,0.07)] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7B849B]">Editorial</p>
            <h3 className="text-xl font-extrabold text-[#18233B]">Latest Saving Stories</h3>
          </div>
          <Link href="/blogs" className="rounded-full border border-[#DCCEFF] bg-[#F7F2FF] px-3 py-1.5 text-xs font-semibold text-[#5B3CC4]">
            View All Blogs
          </Link>
        </div>
        <div className="mb-3 flex items-center justify-end gap-2 pr-1">
          <button
            type="button"
            aria-label="Previous latest story"
            ref={latestStoriesPrevRef}
            className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next latest story"
            ref={latestStoriesNextRef}
            className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
          >
            ›
          </button>
        </div>
        <div>
          {blogsLoading && blogs.length === 0 ? (
            <GridSkeleton count={3} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" itemClassName="h-60 rounded-xl bg-gray-200" />
          ) : latestStoryBlogs.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              className="w-full"
              pagination={{ clickable: true }}
              navigation={{ prevEl: latestStoriesPrevRef.current, nextEl: latestStoriesNextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = latestStoriesPrevRef.current;
                swiper.params.navigation.nextEl = latestStoriesNextRef.current;
              }}
              autoplay={{ delay: 2600, disableOnInteraction: false }}
              spaceBetween={14}
              loop
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
            >
              {latestStoryBlogs.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <BlogCard
                    blog={blog}
                    forceFullHeight
                    showViewButton
                    compact
                    fixedHeight="320px"
                    headingClamp={1}
                    descriptionClamp={3}
                    descriptionLimit={120}
                    className="h-full"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-sm text-[#6C768F]">No blog posts available.</p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll p-4">
        {reviewsLoading && reviews.length === 0 ? (
          <RowSkeleton count={3} />
        ) : Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </ArrowScrollRow>
      <TextLink text="Deal of the " colorText="Week" link="/deal" linkText="View All" />
      <ArrowScrollRow controlsClassName="px-4" scrollerClassName="flex gap-4 overflow-x-scroll px-4">
        {dealsLoading && deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : weeklyDeals.map((deal) => (
          <DealOfWeek key={deal._id} data={deal} />
        ))}
      </ArrowScrollRow>

      <FAQ data={data.faqs} imageUrl={data.faqImage} />

      <section className="mx-4 mt-8 overflow-hidden rounded-[28px] border border-[#E2D9FF] bg-[linear-gradient(115deg,#211045_0%,#45218B_45%,#6A39D9_100%)] p-5 text-white shadow-[0_20px_45px_rgba(36,16,82,0.35)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
              Verified Savings Platform
            </p>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
              {heroHeading}
            </h2>
            <div
              className="mt-3 max-w-xl overflow-hidden text-sm leading-6 text-white/80 sm:text-base [&_p]:mb-2 [&_p]:last:mb-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-white [&_a]:underline"
              style={!showFullHeroDescription ? { maxHeight: "86px" } : undefined}
              dangerouslySetInnerHTML={{ __html: fullHeroDescriptionHtml }}
            />
            {hasTrimmedHeroDescription && (
              <button
                type="button"
                onClick={() => setShowFullHeroDescription((prev) => !prev)}
                className="mt-2 text-xs font-semibold text-white underline underline-offset-4 hover:text-white/85"
              >
                {showFullHeroDescription ? "Show less" : "Read more"}
              </button>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <CountryLink href="/deals" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#4722A5] transition hover:bg-[#F2EAFF]">
                Explore Deals
              </CountryLink>
              <CountryLink href="/store" className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20">
                Browse Stores
              </CountryLink>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Popular Stores</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {heroPopularStores.map((store) => (
                <CountryLink
                  key={store._id}
                  href={`/store/${store.slug || ""}`}
                  prefetch
                  className="rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/20"
                >
                  {store.storeName || "Store"}
                </CountryLink>
              ))}
              {heroPopularStores.length === 0 && (
                <span className="text-xs text-white/75">No stores available for selected country.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      </main>
    
    </>
  );
}


export default Home;
