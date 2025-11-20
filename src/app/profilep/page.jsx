"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import ProfileImage from "../../assets/ProfileImage.jpg";
import Banner from "../../components/Minor/Banner";
import HeadingText from "../../components/Minor/HeadingText";
import ReviewCard from "../../components/cards/ReviewCard";
import TextLink from "../../components/Minor/TextLink";
import { fetchReviews, addReview } from "../../redux/review/reviewSlice";
import { fetchReferralLink,fetchMyReferrals } from "@/redux/referral/referralSlice";
import Cookies from "js-cookie";

import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaCopy,
  FaTimes,
  FaShareAlt,
} from "react-icons/fa";

const DEFAULT_REVIEW_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/219/219988.png";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const allCookies = Cookies.get();
  console.log("allCookies",allCookies)
  // ✅ all states declared first
  const [isMounted, setIsMounted] = useState(false);
  const [userNameFromCookie, setUserNameFromCookie] = useState("");
  const [userEmailFromCookie, setUserEmailFromCookie] = useState("");
  const [userId, setUserId] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [referrals, setReferrals] = useState([]); // original fetched data
const [filteredReferrals, setFilteredReferrals] = useState([]);
const [searchValue, setSearchValue] = useState("");

  // Filter referrals based on search term
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredReferrals(referrals); // reset to original
    } else {
      const filtered = referrals.filter(
        (r) =>
          r.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredReferrals(filtered);
    }
  }, [searchValue, referrals]);
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://example.com";

  // ✅ stable cookie reader
  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : "";
  };

  // ✅ mount flag to prevent hydration mismatch
  useEffect(() => {
    dispatch(fetchMyReferrals())
      .unwrap()
      .then((data) => {
        setReferrals(data.referrals || []);
        setFilteredReferrals(data.referrals || []);
      })
      .catch((err) => console.error("Failed to fetch referrals:", err));
  }, [dispatch]);
 
    
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ safely fetch referral link
  useEffect(() => {
    if (!isMounted) return;
  
    dispatch(fetchReferralLink())
      .unwrap()
      .then((data) => setReferralLink(data.referralLink))
      .catch((err) => setReferralLink(`${SERVER_URL}/signup`));
  }, [dispatch, isMounted]);
  
  

  // ✅ cookie-based user check
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserNameFromCookie(getCookie("userName"));
      setUserEmailFromCookie(getCookie("userEmail"));
      setUserId(getCookie("userId"));

      if (
        !getCookie("userName") &&
        !getCookie("userEmail") &&
        !getCookie("userId")
      ) {
        router.push(`/`);
      }
    }
  }, [router]);

  // ✅ fetch reviews
  const { reviews = [], loading } = useSelector((state) => state.reviews);
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // ✅ guard rendering until after mount
  if (!isMounted) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const user = {
    name: userNameFromCookie,
    email: userEmailFromCookie,
    avatar: ProfileImage,
    designation: "user",
  };

  // ✅ validation and submit handlers
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
        toast.success("Review submitted successfully!");
        setSubmitted(true);
        setDesc("");
        dispatch(fetchReviews());
      })
      .catch((err) => {
        console.error("Failed to submit review:", err);
        toast.error("Failed to submit review. Please try again.");
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.info("Copied to clipboard!");
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4  py-8 bg-[#592EA9]">
          <div className="w-28 h-28 rounded-full border-4 border-indigo-600 overflow-hidden">
            <Image
              src={user.avatar}
              alt={user.name}
              width={112}
              height={112}
              className="object-cover h-full"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">{`Hi, ${user.name}`}</h1>
          <p className="text-sm text-white">{user.email}</p>
        </div>
{/* Running Cashback Banner */}
<div className="w-full overflow-hidden bg-[#f3e8ff] py-3 shadow-md"> 
  <div className="marquee">
    <div className="marquee-content text-[#592EA9] font-medium text-sm md:text-base tracking-wide">
      Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon. 💜✨
      &nbsp;•&nbsp;
      Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon. 💜✨
      &nbsp;•&nbsp;
      Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon. 💜✨
    </div>
  </div>
</div>


        {/* Share App Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#592ea9] text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <FaShareAlt /> Share App
          </button>
        </div>

        {/* Coupon Section */}
        <HeadingText
  title="My Coupon Stock"
  content={`
    <div style="line-height: 1.7; font-size: 15px; color:#444;">
      <ul style="list-style: disc; padding-left: 18px; margin-top: 8px;">

        <li>
          Receive <strong>₹5,000 worth of Welcome e-Gift vouchers</strong> from top
          brands like Yatra, Pantaloons, Hush Puppies, and Shoppers Stop.
        </li>

        <li>
          Get <strong>free movie tickets worth ₹6,000 every year</strong>.<br/>
          Valid for <strong>2 tickets per booking per month</strong>.<br/>
          Maximum discount: <strong>₹500 for 2 tickets</strong>.
        </li>

        <li>
          Earn <strong style="color:#592EA9;">5X Reward Points</strong> on Dining,
          Departmental Stores, and Grocery spends.
        </li>

        <li>
          Earn <strong>2 Reward Points</strong> per ₹100 on all other spends
          <span style="color:#777;">(except fuel)</span>.
        </li>

        <li>
          <strong>1% fuel surcharge waiver</strong> at all fuel stations for transactions
          between ₹500 – ₹4,000.<br/>
          Maximum benefit: <strong>₹250/month</strong>.
        </li>

        <li>
          Enjoy <strong>6 complimentary International Airport lounge visits</strong>
          every year <span style="color:#666;">(2 visits per quarter)</span>.
        </li>

        <li>
          Get <strong>2 complimentary Domestic Airport lounge visits</strong> every quarter.
        </li>

        <li>
          Lowest <strong>1.99% Forex Mark-up Fee</strong> on international transactions.
        </li>

      </ul>
    </div>
  `}
  isHtml={true}
/>


        {/* Banner */}
        {/* <Banner
          Text="Great deals aren’t luck"
          ColorText="lifestyle"
          BgImage="https://assets.indiadesire.com/images/Flipkart%20BBD%202025.jpg"
          link="https://www.flipkart.com/"
        /> */}

        {/* Review Form */}
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
                  <div className="w-16 h-16 rounded overflow-hidden ">
                    <Image
                      src={DEFAULT_REVIEW_IMAGE}
                      alt="review avatar"
                      width={64}
                      height={64}
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
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
   
        <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Referrals</h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
      <input
  type="text"
  placeholder="Search by name or email..."
  className="border border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
/>

      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">S.No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Joined On</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReferrals.length > 0 ? (
              filteredReferrals.map((referral, idx) => (
                <tr key={referral._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm">{referral.name}</td>
                  <td className="px-6 py-4 text-sm">{referral.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No referrals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
        {/* Reviews Section */}
        <TextLink text="Public" colorText="Reviews" link="" linkText="" />
        <div className="p-4 flex gap-4 overflow-x-scroll">
          {loading && <p>Loading reviews...</p>}
          {!loading && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} data={review} />
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 w-11/12 max-w-md p-8 animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6 tracking-wide">
              Share Our App and Earn Cashback
            </h2>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Your App Server URL:</p>
              <div className="flex items-center justify-center gap-3 bg-gray-50 px-3 py-2 rounded-lg shadow-inner">
                <span className="text-indigo-700 text-sm font-medium break-all select-text">
                  {referralLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition"
                  title="Copy Link"
                >
                  <FaCopy size={14} />
                </button>
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-6 mt-6">
              <a
                href={`https://wa.me/?text=Check%20out%20this%20amazing%20app!%20${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition transform hover:scale-110"
              >
                <FaWhatsapp size={28} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition transform hover:scale-110"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  referralLink
                )}&text=Check%20out%20this%20app!`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-sky-100 hover:bg-sky-200 rounded-full text-sky-500 transition transform hover:scale-110"
              >
                <FaTwitter size={28} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-700 transition transform hover:scale-110"
              >
                <FaLinkedin size={28} />
              </a>
            </div>

            <p className="text-xs text-center text-gray-500 mt-8">
              Spread the word and help others discover our platform 💜
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;