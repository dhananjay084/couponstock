"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/blog/blogSlice";
import BlogCard from "../../components/cards/BlogCard";
import RecentBlogCard from "../../components/cards/NewBlogCard";
import { toast } from "react-toastify";
import { RowSkeleton } from "../../components/skeletons/InlineSkeletons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blogs || {});
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
    <div className="p-4 md:p-8 bg-gradient-to-b from-[#F7F4FF] to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#592EA9]">
          Latest Stories
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Fresh deals, tips, and shopping guides curated by Mycouponstock.
        </p>

        {/* Featured Slider */}
        <div className="mb-10">
          {loading && sorted.length === 0 ? (
            <RowSkeleton count={2} itemClassName="h-44 w-full rounded-lg bg-gray-200" />
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              spaceBetween={16}
              loop
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {sorted.slice(0, 6).map((blog) => (
                <SwiperSlide key={blog._id} style={{ height: "520px" }}>
                  <BlogCard
                    blog={blog}
                    forceFullHeight
                    descriptionLimit={140}
                    descriptionSuffix=".."
                    className="h-full"
                    fixedHeight="520px"
                    headingClamp={2}
                    descriptionClamp={4}
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
