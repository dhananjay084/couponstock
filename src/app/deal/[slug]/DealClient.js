"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
} from "@mui/material";
import HeadingText from "../../../components/Minor/HeadingText";
import DealCard from "../../../components/cards/DealCard";
import { getDeals } from "../../../redux/deal/dealSlice";
import ReviewCard from "../../../components/cards/ReviewCard";
import { fetchReviews } from "../../../redux/review/reviewSlice";
import TextLink from "../../../components/Minor/TextLink";
import LoginModal from "../../../components/modals/loginModal";
import { useRouter } from "next/navigation";
import { RowSkeleton, TextSkeleton } from "../../../components/skeletons/InlineSkeletons";
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
const DealDetailsContent = ({ initialDeal }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealDetails, setDealDetails] = useState(initialDeal || null);
  const [loading, setLoading] = useState(!initialDeal);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState("");
  
  const category = searchParams?.get("category") || "";
  const { deals = [] } = useSelector((state) => state.deal);
  const { reviews = [] } = useSelector((state) => state.reviews);
  const { selectedCountry } = useSelector((state) => state.country || {});
  const router = useRouter();
  const [userId, setUserId] = useState("");

  // Fetch deal by slug
  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setLoading(false);
      return;
    }

    if (initialDeal && initialDeal.slug === slug) {
      setDealDetails(initialDeal);
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
  }, [slug, category, router, initialDeal]);

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
    if (!selectedCountry) return;
    dispatch(getDeals(selectedCountry));
    dispatch(fetchReviews());
  }, [dispatch, selectedCountry]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <TextSkeleton className="h-6 w-64" />
        <TextSkeleton className="h-8 w-3/4" />
        <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
        <RowSkeleton count={3} />
      </div>
    );
  }

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

  const isStructured = dealDetails.layoutFormat === "structured";
  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <>
      {!isStructured && (
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
            <Typography variant="h4" sx={{ fontSize: '22px', color: "#592EA9", fontWeight: "700" }}>
              {dealDetails.dealTitle}
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

          {dealDetails.homePageTitle && (
            <Typography variant="h5" sx={{ fontSize: '18px', color: "#592EA9", fontWeight: "600" }} maxWidth='95%' marginX='auto'>
              {dealDetails.homePageTitle}
            </Typography>
          )}

          <HeadingText
            title="Deal Details"
            isHtml={true}
            content={dealDetails.details}
          />
        </>
      )}

      {isStructured && (
        <div className="mx-auto max-w-6xl p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {dealDetails.dealTitle}
            </h1>
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
          </div>
          <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-8 shadow-sm lg:grid-cols-2">
            <div className="flex items-center justify-center">
              {(dealDetails.descriptionImage || dealDetails.dealImage) && (
                <img
                  src={dealDetails.descriptionImage || dealDetails.dealImage}
                  alt={dealDetails.dealTitle || "Deal"}
                  className="max-h-80 w-full object-contain"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {dealDetails.tagPrimary && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {dealDetails.tagPrimary}
                  </span>
                )}
                {dealDetails.tagSecondary && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {dealDetails.tagSecondary}
                  </span>
                )}
              </div>

              {dealDetails.headline && (
                <h2 className="text-xl font-semibold text-gray-800">
                  {dealDetails.headline}
                </h2>
              )}

              {(dealDetails.usedTodayText || dealDetails.successRateText) && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {dealDetails.usedTodayText && (
                    <span>🔥 {dealDetails.usedTodayText}</span>
                  )}
                  {dealDetails.successRateText && (
                    <span>✅ {dealDetails.successRateText}</span>
                  )}
                </div>
              )}

              {dealDetails.dealDescription && (
                <p className="text-gray-700">{dealDetails.dealDescription}</p>
              )}

              {dealDetails.couponCode && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-purple-400 bg-purple-50 px-4 py-3">
                  <span className="font-semibold text-gray-700">{dealDetails.couponCode}</span>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#592EA9",
                      borderRadius: "10px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#4a2380" },
                    }}
                    onClick={() => navigator.clipboard.writeText(dealDetails.couponCode)}
                  >
                    Copy
                  </Button>
                </div>
              )}

              {dealDetails.endingSoonText && (
                <div className="text-sm font-medium text-red-500">⏳ {dealDetails.endingSoonText}</div>
              )}

              <div className="space-y-2 text-sm text-gray-700">
                {dealDetails.store && (
                  <div><span className="font-semibold">Brand:</span> {dealDetails.store}</div>
                )}
                {dealDetails.discount && (
                  <div><span className="font-semibold">Discount:</span> {dealDetails.discount}</div>
                )}
                {dealDetails.userTypeText && (
                  <div><span className="font-semibold">Users:</span> {dealDetails.userTypeText}</div>
                )}
                {dealDetails.expiredDate && (
                  <div><span className="font-semibold">Expiry:</span> {formatDate(dealDetails.expiredDate)}</div>
                )}
                {Array.isArray(dealDetails.country) && dealDetails.country.length > 0 && (
                  <div><span className="font-semibold">Country:</span> {dealDetails.country.join(", ")}</div>
                )}
              </div>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#592EA9",
                  borderRadius: "999px",
                  padding: "12px 28px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#4a2380" },
                }}
                onClick={handleShopNow}
              >
                Activate Deal →
              </Button>
            </div>
          </div>
        </div>
      )}

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
        {deals.length === 0 ? (
          <RowSkeleton count={3} />
        ) : deals
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

      {!isStructured && (
        <HeadingText
          title={dealDetails.dealTitle}
          isHtml={true}
          content={dealDetails.dealDescription}
        />
      )}

      <TextLink text="User" colorText="Reviews" link="" linkText="" />

      <div className="pt-0 p-4 flex gap-4 overflow-x-scroll">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} data={review} />
          ))
        ) : (
          <RowSkeleton count={2} />
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
const DealDetailsPage = ({ deal }) => {
  return (
    <Suspense
      fallback={
        <div className="p-4 space-y-4">
          <TextSkeleton className="h-6 w-64" />
          <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
          <RowSkeleton count={3} />
        </div>
      }
    >
      <DealDetailsContent initialDeal={deal} />
    </Suspense>
  );
};

export default DealDetailsPage;
