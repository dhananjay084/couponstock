"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileImage from "../../assets/ProfileImage.jpg";
import Banner from "../../components/Minor/Banner";
import HeadingText from "../../components/Minor/HeadingText";
import ReviewCard from "../../components/cards/ReviewCard";
import TextLink from "../../components/Minor/TextLink";
import { fetchReviews, addReview } from "../../redux/review/reviewSlice.js";
import { useSelector, useDispatch } from "react-redux";
import BannerImage from "@/assets/banner-image.webp";

const DEFAULT_REVIEW_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/219/219988.png";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userNameFromCookie, setUserNameFromCookie] = useState("");
  const [userEmailFromCookie, setUserEmailFromCookie] = useState("");
  const [userId, setUserId] = useState("");

  // safe cookie reading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name) => {
        const match = document.cookie.match(
          new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? decodeURIComponent(match[2]) : "";
      };

      setUserNameFromCookie(getCookie("userName"));
      setUserEmailFromCookie(getCookie("userEmail"));
      setUserId(getCookie("userId"));

      if (!getCookie("userName") && !getCookie("userEmail") && !getCookie("userId")) {
        router.push(`/`);
      }
    }
  }, [router]);

  const { reviews = [], loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const user = {
    name: userNameFromCookie,
    email: userEmailFromCookie,
    avatar: ProfileImage,
    designation: "user",
  };

  // ...rest of your component stays the same
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const err = {};
    if (!desc.trim()) err.desc = "Description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: user.name,
      designation: user.designation,
      email: user.email,
      desc: desc,
      image: DEFAULT_REVIEW_IMAGE,
    };

    dispatch(addReview(payload))
      .unwrap()
      .then(() => {
        setSubmitted(true);
        setDesc("");
        dispatch(fetchReviews());
      })
      .catch((err) => {
        console.error("Failed to submit review:", err);
      });
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="flex flex-col items-center gap-4 mb-12 py-8 bg-[#592EA9]">
        <div className="w-28 h-28 rounded-full border-4 border-indigo-600 overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            width={112}
            height={112}
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold text-white">{`Hi, ${user.name}`}</h1>
        <p className="text-sm text-white">{user.email}</p>
      </div>

      <HeadingText
        title="My Coupon Stock"
        content={`<ul>
            <li>₹5,000 worth of Welcome e-Gift vouchers from popular brands like Yatra, Pantaloons, Hush Puppies, or Shoppers Stop.</li>
            <li>Free movie ticket worth ₹6,000 every year. Transaction valid for at least 2 tickets per booking per month. Maximum discount is ₹500 for 2 tickets only.</li>
            <li>Get <strong>5X Reward Points</strong> on Dining, Departmental Stores, and Grocery spends.</li>
            <li>Earn <strong>2 Reward Points</strong> per ₹100 on all other spends except fuel.</li>
            <li><strong>1% fuel surcharge waiver</strong> at all fuel stations in India for transactions between ₹500 to ₹4,000. Maximum surcharge waiver of ₹250 per month, per statement cycle.</li>
            <li>Get <strong>6 complimentary International Airport lounge visits</strong> every year (2 visits per quarter).</li>
            <li>Enjoy <strong>2 complimentary Domestic Airport lounge visits</strong> every quarter.</li>
            <li>Lowest <strong>Foreign Currency Mark-up charge</strong> at 1.99% on international usage.</li>
          </ul>`}
        isHtml={true}
      />

      <Banner
        Text="Every day we the most interesting things"
        ColorText="discuss"
        BgImage={BannerImage.src}
      />

      <div className="mx-auto px-4 my-8">
        <div className="rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>

          {submitted && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              Review submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Description</label>
              <textarea
                name="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Write your review..."
                className={`resize-none border rounded px-3 py-2 focus:outline-none ${
                  errors.desc ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.desc && (
                <p className="text-xs text-red-600 mt-1">{errors.desc}</p>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded overflow-hidden border">
                  <Image
                    src={DEFAULT_REVIEW_IMAGE}
                    alt="review avatar"
                    width={64}
                    height={64}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/64?text=Invalid";
                    }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  Review will be submitted as{" "}
                  <strong>{user.name}</strong> ({user.designation})
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>

      <TextLink text="Public" colorText="Reviews" link="" linkText="" />
      <div className="p-4 flex gap-4 overflow-x-scroll">
        {loading && <p>Loading reviews...</p>}
        {!loading && reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review._id} data={review} />)
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
