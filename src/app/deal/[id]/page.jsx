// src/app/deal/[id]/page.js

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Banner from "@/components/Minor/Banner";
import Image from "@/assets/banner-image.webp";
import {
  Typography,
  CircularProgress,
  Box,
  Button,
  Divider,
} from "@mui/material";
import HeadingText from "@/components/Minor/HeadingText";
import DealCard from "@/components/cards/DealCard";
import { useSelector, useDispatch } from "react-redux";
import { getDeals } from "@/redux/deal/dealSlice";
import ReviewCard from "@/components/cards/ReviewCard";
import { fetchReviews } from "@/redux/review/reviewSlice";
import TextLink from "@/components/Minor/TextLink";
import CouponModal from "@/components/modals/couponModels.jsx";
import axios from "axios";
import LoginModal from "@/components/modals/loginModal";
import { useRouter } from "next/navigation";

const DealDetailsContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ Get dynamic params in client components
  const id = params?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealDetails, setDealDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState(""); // new

  const category = searchParams?.get("category") || "";

  const { deals = [] } = useSelector((state) => state.deal);
  const { reviews = [] } = useSelector((state) => state.reviews);

  const handleCardClick = () => setModalOpen(true);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setLoading(false);
      return;
    }

    const fetchDealById = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/${id}`);
        setDealDetails(res.data);
        // toast.success("Deal details loaded!");
      } catch (err) {
        console.error("Error fetching deal:", err);
        // toast.error("Failed to load deal details!");
      } finally {
        setLoading(false);
      }
    };

    fetchDealById();
  }, [id]);
    const router = useRouter();
  
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

   
      setUserId(getCookie("userId"));

   
    }
  }, [router]);
  useEffect(() => {
    dispatch(getDeals());
    dispatch(fetchReviews());
  }, [dispatch]);
  if (loading)
    return <p className="text-center p-4">Loading deal details...</p>;

  if (!dealDetails)
    return <p className="text-center p-4 text-red-500">Deal not found.</p>;

  return (
    <>
      <div>
        <Banner
          Text="Great deals aren’t luck – they’re a"
          ColorText="lifestyle"
          BgImage='https://assets.indiadesire.com/images/Flipkart%20BBD%202025.jpg'
        />
{/* 
        <div className="flex justify-between items-center p-4">
          <Typography color="#592ea9">{dealDetails.homePageTitle}</Typography>
          {dealDetails.dealCategory === "deal" ? (
            <button className="bg-[#592EA9] rounded-[10px] p-2 text-white cursor-pointer"  onClick={() => setIsModalOpen(true)}>
              Shop Now
            </button>
          ) : (
            <button
              className="bg-[#592EA9] rounded-[10px] p-2 text-white cursor-pointer"
              onClick={handleCardClick}
            >
              Show Code
            </button>
          )}
        </div>

        <div className="px-4">
          <h2 className="font-semibold text-xl">{dealDetails.dealTitle}</h2>
        </div> */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
          maxWidth='95%'
          marginX='auto'
          marginTop={2}
        >
          <Typography variant="h5" sx={{ fontSize:'20px' , color: "#592EA9", fontWeight: "600" }}>
            {dealDetails.homePageTitle}
          </Typography>

          <Button
  variant="contained"
  sx={{
    backgroundColor: "#592EA9",
    borderRadius: "10px",
    padding: "10px 24px",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#4a2380",
    },
  }}
  onClick={() => {
    if (dealDetails.dealCategory === "deal") {
      if (userId) {
        // logged in, proceed as usual
        let trackedUserId = userId;
  
        const now = new Date();
        const timeString =
          String(now.getHours()).padStart(2, "0") +
          String(now.getMinutes()).padStart(2, "0") +
          String(now.getSeconds()).padStart(2, "0") +
          String(now.getMilliseconds()).padStart(3, "0");
  
        trackedUserId = `${userId}TIME${timeString}`;
  
        const redirectUrl = `${dealDetails.redirectionLink}&user_id=${encodeURIComponent(trackedUserId)}`;
        window.open(redirectUrl, "_blank");
      } else {
        // not logged in: open login modal with redirection URL
        setLoginRedirectUrl(dealDetails.redirectionLink);
        setIsModalOpen(true);
      }
    } else {
      handleCardClick(); // For "Show Code" flow
    }
  }}
  
  
>
  {dealDetails.dealCategory === "deal" ? "Shop Now" : "Show Code"}
</Button>
        </Box>

        {/* Deal Title */}
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#333",fontSize:'18px' }}
           maxWidth='95%'
          marginX='auto'
        >
          {dealDetails.dealTitle}
        </Typography>

        {/* Deal Details */}
        <HeadingText
          title="Deal Details"
          isHtml={true}
          content={dealDetails.details}
        />

        {/* <HeadingText
          title={dealDetails.dealTitle}
          isHtml={true}
          content={dealDetails.details}
        /> */}
   <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#592EA9",fontSize:'18px' }}
           maxWidth='95%'
          marginX='auto'
        >
          Related Deals
        </Typography>
        <div className="flex overflow-x-scroll gap-4 p-4">
          {deals
            .filter(
              (deal) =>
                deal.categorySelect === category &&
                deal._id !== id &&
                deal.dealCategory === "deal"
            )
            .map((deal) => (
              <DealCard key={deal._id} data={deal} />
            ))}
        </div>

        <HeadingText
          title={dealDetails.dealTitle}
          isHtml={true}
          content={dealDetails.dealDescription}
        />

        <TextLink text="User" colorText="Reviews" link="" linkText="" />

        <div className="pt-0 p-4 flex gap-4 overflow-x-scroll">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} data={review} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No reviews found.
            </p>
          )}
        </div>
      </div>

      <CouponModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={dealDetails}
      />
   <LoginModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  redirectUrl={loginRedirectUrl}
/>

    </>
  );
};

// ================== Main Page ==================
const DealDetailsPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <DealDetailsContent />
    </Suspense>
  );
};

export default DealDetailsPage;
