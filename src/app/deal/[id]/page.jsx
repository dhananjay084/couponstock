// src/app/deal/[id]/page.js

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Banner from "@/components/Minor/Banner";
import Image from "@/assets/banner-image.webp";
import { Typography, CircularProgress, Box } from "@mui/material";
import HeadingText from "@/components/Minor/HeadingText";
import DealCard from "@/components/cards/DealCard";
import { useSelector, useDispatch } from "react-redux";
import { getDeals } from "@/redux/deal/dealSlice";
import ReviewCard from "@/components/cards/ReviewCard";
import { fetchReviews } from "@/redux/review/reviewSlice";
import TextLink from "@/components/Minor/TextLink";
import CouponModal from "@/components/modals/couponModels.jsx";
import axios from "axios";
import Modal from '../../../components/modals/loginModal'
// ================== Deal Details Component ==================
const DealDetailsContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ Get dynamic params in client components
  const id = params?.id;

  const [dealDetails, setDealDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const category = searchParams?.get("category") || "";

  const { deals = [] } = useSelector((state) => state.deal);
  const { reviews = [] } = useSelector((state) => state.reviews);
  const [loginmodalOpen, setloginModalOpen] = useState(false);
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
          Text="Every day we the most interesting things"
          ColorText="discuss"
          BgImage={Image.src}
        />

        <div className="flex justify-between items-center p-4">
          <Typography color="#592ea9">{dealDetails.homePageTitle}</Typography>
          {dealDetails.dealCategory === "deal" ? (
            <button className="bg-[#592EA9] rounded-[10px] p-2 text-white cursor-pointer" onClick={()=>setloginModalOpen(true)}>
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
        </div>

        <HeadingText
          title={dealDetails.dealTitle}
          isHtml={true}
          content={dealDetails.details}
        />

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

        <TextLink text="Loft User" colorText="Reviews" link="" linkText="" />

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
       <Modal isOpen={loginmodalOpen} onClose={() => setloginModalOpen(false)} />
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
