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

const teamImages = [UserImage, UserImage, UserImage];

const AboutUs = () => {
  const dispatch = useDispatch();
  const { reviews = [] } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  return (
    <>
      {/* Intro */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-16 justify-between items-start gap-8 mb-16 max-w-7xl mx-auto">
        <div className="md:w-1/4 w-full">
          <h1 className="font-semibold text-3xl md:text-4xl">About Us</h1>
        </div>
        <div className="md:w-3/4 w-full space-y-4 text-gray-700 text-sm md:text-base">
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.{" "}
            <span className="text-indigo-600 underline cursor-pointer">
              see more
            </span>
          </p>
        </div>
      </div>

      {/* Banner */}
      <Banner Text="" ColorText="" BgImage={BannerImage.src} />

      {/* Quote + Image */}
      <div className="max-x-full lg:max-w-[75%] mx-auto lg:flex lg:justify-between lg:items-center my-16">
        <h1 className="font-normal text-2xl max-w-full lg:max-w-[30%] text-center">
          “Our Work does make sense only if it is a faithful witness of his
          time”
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
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
