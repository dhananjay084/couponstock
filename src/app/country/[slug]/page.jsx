"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import TextLink from "../../../components/Minor/TextLink";
import Coupons_Deals from "../../../components/cards/Coupons_Deals";
import HeadingText from "../../../components/Minor/HeadingText";
import { getDeals } from "../../../redux/deal/dealSlice";
import { GridSkeleton } from "../../../components/skeletons/InlineSkeletons";
import { titleize } from "../../../lib/slugify";
import { setSelectedCountry } from "../../../redux/country/countrySlice";

const CountryDealsPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const countrySlug = params?.slug ? decodeURIComponent(params.slug) : "";
  const countryName = titleize(countrySlug.replace(/-/g, " "));

  const { deals = [], loading: dealsLoading } = useSelector((state) => state.deal || { deals: [], loading: false });

  useEffect(() => {
    if (countryName) {
      dispatch(setSelectedCountry(countryName));
    }
    dispatch(getDeals(countryName));
  }, [dispatch, countryName]);

  const filteredDeals = deals.filter((deal) =>
    Array.isArray(deal.country)
      ? deal.country.some((c) => c?.toLowerCase?.() === countryName.toLowerCase())
      : deal.country?.toLowerCase?.() === countryName.toLowerCase()
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#592EA9] mb-4">
        Deals in {countryName}
      </h1>

      <TextLink text={countryName} colorText="Deals" link="" linkText="" />

      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:justify-around">
        {dealsLoading && filteredDeals.length === 0 ? (
          <GridSkeleton count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" itemClassName="h-40 rounded-lg bg-gray-200" />
        ) : filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <Coupons_Deals key={deal._id} data={deal} border={true} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No deals found for this country.</p>
        )}
      </div>

      <HeadingText
        title={`${countryName} Deals`}
        content={`Browse the latest offers, coupons, and deals available in ${countryName}.`}
        isHtml={false}
      />
    </div>
  );
};

export default CountryDealsPage;
