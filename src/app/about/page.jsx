"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Banner from "@/components/Minor/Banner";
import UserImage from "@/assets/ProfileImage.jpg";
import BannerImage from "@/assets/banner-image.webp";
import TextLink from "@/components/Minor/TextLink";
import ReviewCard from "@/components/cards/ReviewCard.jsx";
import { fetchReviews } from "@/redux/review/reviewSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const teamImages = [UserImage, UserImage, UserImage];

const AboutUs = () => {
  const dispatch = useDispatch();
  const { reviews = [] ,  error: reviewError } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  useEffect(() => {
  if (reviewError) {
    toast.error("Failed to load reviews!");
  } else if (reviews.length > 0) {
    // toast.success("Reviews loaded!");
  }
}, [reviewError, reviews]);


  return (
    <>
      {/* Intro */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-16 justify-between items-start gap-8 mb-16 max-w-7xl mx-auto">
        <div className="md:w-1/4 w-full">
          <h1 className="font-semibold text-3xl md:text-4xl">About Us</h1>
        </div>
        <div className="md:w-3/4 w-full space-y-4 text-gray-700 text-sm md:text-base">
          <p className="leading-relaxed">
          My Coupon Stock was founded in 2021 with the mission to provide coupon codes, discounts, and voucher codes to its users so they can shop with less burden on their pockets. Our coupon range is from electronics to cosmetics to VPNs and many more; whatever brand crosses your mind, we have it. We created this user-friendly website, which will make it very convenient to access (with every device) coupons in a very smooth way within minutes.
          </p>
          <p className="leading-relaxed">
          All the latest discount coupons, promo codes, voucher codes, and free coupons get updated here without any delay. Get ready for exciting offers and save more. Happy Shopping.
For more details or further queries, you can visit our 

            <a href="/contact" className="text-indigo-600 ml-2 cursor-pointer">
            Contact Us  page            </a>
          </p>
        </div>
      </div>

      {/* Banner */}
      <Banner Text="" ColorText="" BgImage='https://assets.indiadesire.com/images/Flipkart%20BBD%202025.jpg'/>

      {/* Quote + Image */}
      <div className="max-x-full lg:max-w-[75%] mx-auto lg:flex lg:justify-between lg:items-center my-16">
        <h1 className="font-normal text-2xl max-w-full lg:max-w-[30%] text-center">
        “Great deals aren’t luck – they’re a lifestyle.”

        </h1>
        <div className="relative w-[50%] hidden lg:block h-[300px]">
          <Image src={BannerImage} alt="Quote" fill style={{ objectFit: "cover" }} />
        </div>
      </div>

      {/* Team Section */}
      <section className="flex flex-col lg:flex-row px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mb-20 gap-12">
        {/* Image cluster */}
        <div className="w-full lg:w-1/2 flex-shrink-0">
          {/* Desktop cluster */}
          <div className="hidden lg:flex gap-8">
            <div className="flex flex-col gap-8">
              <div className="rounded-xl overflow-hidden shadow-md w-60 h-60 relative">
                <Image src={teamImages[0]} alt="Team member 1" fill style={{ objectFit: "cover" }} />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md w-60 h-60 relative">
                <Image src={teamImages[1]} alt="Team member 2" fill style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="self-center rounded-xl overflow-hidden shadow-md w-72 h-72 relative">
              <Image src={teamImages[2]} alt="Team member 3" fill style={{ objectFit: "cover" }} />
            </div>
          </div>

          {/* Tablet fallback */}
          <div className="hidden md:flex lg:hidden gap-6">
            <div className="flex flex-col gap-6">
              <div className="rounded-xl overflow-hidden shadow-md w-52 h-52 relative">
                <Image src={teamImages[0]} alt="Team member 1" fill style={{ objectFit: "cover" }} />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md w-52 h-52 relative">
                <Image src={teamImages[1]} alt="Team member 2" fill style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="self-center rounded-xl overflow-hidden shadow-md w-64 h-64 relative">
              <Image src={teamImages[2]} alt="Team member 3" fill style={{ objectFit: "cover" }} />
            </div>
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {teamImages.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 rounded-xl overflow-hidden shadow-md snap-center relative h-56"
              >
                <Image src={src} alt={`Team member ${i + 1}`} fill style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2 className="font-bold text-3xl mb-6">The Team</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
          Our Team consists of coupon, deals, and Tech individuals who hunt for the best coupon codes and voucher codes from big to small brands for a wide range of products. Our team members from every department work tirelessly because for us customer is the king, and we are ready to serve them without any hindrance 

          </p>
          <p className="text-gray-600 mb-2 leading-relaxed">
          We are not here temporarily; once we build a relationship with our client, we work to cement that relationship. Each team member will utilize their expertise to help you obtain the most desired discount code for your favorite cosmetic brand or your favorite place’s flight ticket. We are not limited to national brands; we have crossed the boundaries of continents. You can also subscribe to our newsletter, so our team can personally send you all updates to your inbox.

          </p>
        </div>
      </section>

      {/* Reviews */}
      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </>
  );
};

export default AboutUs;
