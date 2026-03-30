"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { slugify } from "../lib/slugify";
import { useDispatch, useSelector } from "react-redux";
import { getStores } from "../redux/store/storeSlice";

const toStoreSlug = (name) => slugify(name.replace(/&/g, "and"));
const normalizeType = (value = "") => value.toString().trim().toLowerCase();

const Footer = () => {
  const dispatch = useDispatch();
  const { selectedCountry } = useSelector((state) => state.country || {});
  const { stores = [] } = useSelector((state) => state.store || {});

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getStores(selectedCountry));
  }, [dispatch, selectedCountry]);

  const grouped = useMemo(() => {
    const matchesSection = (store, keywords) => {
      const type = normalizeType(store.storeType);
      return keywords.some((keyword) => type.includes(keyword));
    };

    const byKeywords = (keywords) =>
      stores.filter((store) => matchesSection(store, keywords)).slice(0, 9);

    const fashion = byKeywords(["fashion", "apparel", "clothing"]);
    const beauty = byKeywords(["beauty", "cosmetic", "skincare", "makeup"]);
    const travel = byKeywords(["travel", "flight", "hotel", "booking"]);
    const food = byKeywords(["food", "restaurant", "grocery", "delivery"]);
    const popular = stores.filter((store) => store.popularStore).slice(0, 8);

    const fallback = stores.slice(0, 9);

    return {
      fashion: fashion.length ? fashion : fallback,
      beauty: beauty.length ? beauty : fallback,
      travel: travel.length ? travel : fallback,
      food: food.length ? food : fallback,
      popular: popular.length ? popular : stores.slice(0, 8),
    };
  }, [stores]);

  const renderStoreLinks = (items) => {
    if (!items.length) {
      return <span className="text-gray-500">No stores for selected country.</span>;
    }
    return items.map((store) => {
      const name = store.storeName || "Store";
      const slug = store.slug || toStoreSlug(name);
      return (
        <Link key={store._id || slug} href={`/store/${encodeURIComponent(slug)}`} className="hover:text-white">
          {name}
        </Link>
      );
    });
  };

  return (
    <footer className="bg-black text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white font-semibold mb-4">ABOUT</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">COUPON STOCK</h3>
            <div className="text-white font-bold text-lg mb-3">MyCouponStock</div>
            <ul className="space-y-2">
              <li><Link href="/deals">All Coupons</Link></li>
              <li><Link href="/store">All Stores</Link></li>
              <li><Link href="/category">All Category</Link></li>
            </ul>
            <p className="text-gray-400 mt-4">
              Your Trusted Coupon Stock Partner for Daily Savings
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">GLOBAL COUPONS</h3>
            <ul className="space-y-2">
              <li><Link href="/country/india">India Coupons</Link></li>
              <li><Link href="/country/usa">USA Coupons</Link></li>
              <li><Link href="/country/uk">UK Coupons</Link></li>
              <li><Link href="/country/spain">Spain Coupons</Link></li>
              <li><Link href="/country/germany">Germany Coupons</Link></li>
              <li><Link href="/country/france">France Coupons</Link></li>
              <li><Link href="/country/portugal">Portugal Coupons</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">SOCIAL MEDIA</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/mycouponstock/?_rdr" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaFacebookF />
              </a>
              <a href="https://x.com/mycouponstock" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/mycouponstock/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/mycouponstock/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Category Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-400">
          <div>
            <h4 className="text-white font-semibold mb-2">Fashion</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {renderStoreLinks(grouped.fashion)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Beauty</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {renderStoreLinks(grouped.beauty)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Travel</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {renderStoreLinks(grouped.travel)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Food</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {renderStoreLinks(grouped.food)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Popular Stores</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {renderStoreLinks(grouped.popular)}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 text-gray-500 text-xs text-center">
        © 2026 MyCouponStock. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
