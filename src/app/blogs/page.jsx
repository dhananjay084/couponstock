"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/blog/blogSlice";
import BlogCard from "../../components/cards/BlogCard";
import RecentBlogCard from "../../components/cards/NewBlogCard";
import { toast } from "react-toastify";
import { RowSkeleton } from "../../components/skeletons/InlineSkeletons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blogs || {});
  const latestStoriesPrevRef = useRef(null);
  const latestStoriesNextRef = useRef(null);
  useEffect(() => {
    dispatch(fetchBlogs())
      .unwrap()
      .catch(() => toast.error("Failed to load blogs"));
  }, [dispatch]);

  const sorted = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return [...blogs].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [blogs]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="px-2 pb-10 pt-1">
      <section className="mx-2 mt-3 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Latest Stories
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          Fresh deals, tips, and shopping guides curated by Mycouponstock.
        </p>
      </section>
      <div className="mx-auto mt-8 max-w-6xl">

        {/* Featured Slider */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-end gap-2">
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
          {loading && sorted.length === 0 ? (
            <RowSkeleton count={2} itemClassName="h-44 w-full rounded-lg bg-gray-200" />
          ) : (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ clickable: true }}
              navigation={{ prevEl: latestStoriesPrevRef.current, nextEl: latestStoriesNextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = latestStoriesPrevRef.current;
                swiper.params.navigation.nextEl = latestStoriesNextRef.current;
              }}
              autoplay={{ delay: 2600, disableOnInteraction: false }}
              spaceBetween={16}
              loop
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
            >
              {sorted.slice(0, 6).map((blog) => (
                <SwiperSlide key={blog._id} style={{ height: "320px" }}>
                  <BlogCard
                    blog={blog}
                    forceFullHeight
                    descriptionLimit={120}
                    descriptionSuffix=".."
                    showViewButton
                    compact
                    className="h-full"
                    fixedHeight="320px"
                    headingClamp={2}
                    descriptionClamp={2}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Grid of recent posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && rest.length === 0 ? (
            <RowSkeleton count={4} itemClassName="h-44 w-full rounded-lg bg-gray-200" />
          ) : rest.length > 0 ? (
            rest.map((b) => <RecentBlogCard blog={b} key={b._id} />)
          ) : (
            <p className="text-sm text-gray-500">No more posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
