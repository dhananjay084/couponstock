"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import HeadingText from "@/components/Minor/HeadingText";
import DealCard from "@/components/cards/DealCard";
import { getDeals } from "@/redux/deal/dealSlice";
import ReviewCard from "@/components/cards/ReviewCard";
import { fetchReviews } from "@/redux/review/reviewSlice";
import TextLink from "@/components/Minor/TextLink";
import LoginModal from "@/components/modals/loginModal";
import { useRouter } from "next/navigation";
export async function generateMetadata({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${params.slug}`,
    { cache: "no-store" }
  );

  const deal = await res.json();

  return {
    title:
      deal.metaTitle ||
      `${deal.dealTitle} | My Couponstock`,

    description:
      deal.metaDescription ||
      deal.dealDescription?.slice(0, 150),

    keywords: deal.metaKeywords || "",

    openGraph: {
      title: deal.metaTitle,
      description: deal.metaDescription,
      images: [deal.dealImage],
      type: "website",
    },
  };
}
const DealDetailsContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealDetails, setDealDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState("");
  
  const category = searchParams?.get("category") || "";
  const { deals = [] } = useSelector((state) => state.deal);
  const { reviews = [] } = useSelector((state) => state.reviews);
  const router = useRouter();
  const [userId, setUserId] = useState("");

  // Fetch deal by slug
  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setLoading(false);
      return;
    }

    const fetchDealBySlug = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/slug/${slug}`
        );
        setDealDetails(res.data);
      } catch (err) {
        console.error("Error fetching deal by slug:", err);
        // Fallback: Try to redirect from old ID URLs
        const idMatch = slug.match(/^[0-9a-fA-F]{24}$/);
        if (idMatch) {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals/${slug}`
            );
            setDealDetails(res.data);
            // Optional: Redirect to slug URL
            if (res.data.slug) {
              router.replace(`/deal/${res.data.slug}?category=${category}`);
            }
          } catch (fallbackErr) {
            console.error("Fallback fetch failed:", fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDealBySlug();
  }, [slug, category, router]);

  // Get user ID from cookie
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

  // Fetch deals and reviews
  useEffect(() => {
    dispatch(getDeals());
    dispatch(fetchReviews());
  }, [dispatch]);

  if (loading)
    return <p className="text-center p-4">Loading deal details...</p>;

  if (!dealDetails)
    return <p className="text-center p-4 text-red-500">Deal not found.</p>;

  // Shop Now button click handler
  const handleShopNow = () => {
    if (userId) {
      let trackedUserId = userId;
      const now = new Date();
      const timeString =
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0") +
        String(now.getMilliseconds()).padStart(3, "0");
      
      trackedUserId = `${userId}TIME${timeString}`;
      const encodedUserId = encodeURIComponent(trackedUserId);
      
      let redirectUrl = dealDetails.redirectionLink;
      
      if (redirectUrl.includes("{click_id}")) {
        redirectUrl = redirectUrl.replace("{click_id}", encodedUserId);
      } else {
        const separator = redirectUrl.includes("?") ? "&" : "?";
        redirectUrl = `${redirectUrl}${separator}user_id=${encodedUserId}`;
      }
      
      window.open(redirectUrl, "_blank");
    } else {
      setLoginRedirectUrl(dealDetails.redirectionLink);
      setIsModalOpen(true);
    }
  };

  return (
    <>
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
        <Typography variant="h5" sx={{ fontSize: '20px', color: "#592EA9", fontWeight: "600" }}>
          {dealDetails.homePageTitle}
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#592EA9",
            borderRadius: "10px",
            padding: "10px 24px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#4a2380" },
          }}
          onClick={handleShopNow}
        >
          Shop Now
        </Button>
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        sx={{ color: "#333", fontSize: '18px' }}
        maxWidth='95%'
        marginX='auto'
      >
        {dealDetails.dealTitle}
      </Typography>

      <HeadingText
        title="Deal Details"
        isHtml={true}
        content={dealDetails.details}
      />

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ color: "#592EA9", fontSize: '18px' }}
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
              deal._id !== dealDetails._id &&
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

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redirectUrl={loginRedirectUrl}
      />
    </>
  );
};

// Main Page Component
const DealDetailsPage = () => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      }
    >
      <DealDetailsContent />
    </Suspense>
  );
};

export default DealDetailsPage;