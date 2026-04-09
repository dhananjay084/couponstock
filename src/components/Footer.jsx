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

const Footer = () => {
  const dispatch = useDispatch();
  const { selectedCountry } = useSelector((state) => state.country || {});
  const { stores = [] } = useSelector((state) => state.store || {});

  useEffect(() => {
    if (!selectedCountry) return;
    dispatch(getStores(selectedCountry));
  }, [dispatch, selectedCountry]);

  const grouped = useMemo(() => {
    const popular = stores.filter((store) => store.popularStore).slice(0, 12);
    return {
      popular: popular.length ? popular : stores.slice(0, 12),
    };
  }, [stores]);

  const renderStoreLinks = (items) => {
    if (!items.length) {
      return <span className="text-[#9FAAC0]">No stores for selected country.</span>;
    }
    return items.map((store) => {
      const name = store.storeName || "Store";
      const slug = store.slug || toStoreSlug(name);
      return (
        <Link
          key={store._id || slug}
          href={`/store/${encodeURIComponent(slug)}`}
          prefetch
          className="rounded-full border border-[#263147] bg-[#111a2f] px-2 py-1 text-[11px] text-[#C9D5EF] transition hover:border-[#3B4B6B] hover:text-white"
        >
          {name}
        </Link>
      );
    });
  };

  return (
    <footer className="mt-16 bg-[#0A1020] text-sm text-[#C8D0E2]">
      <div className="border-b border-[#1B2741] bg-[radial-gradient(circle_at_top_right,rgba(91,60,196,0.3),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(15,159,98,0.15),transparent_45%)]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#95A3C2]">MyCouponStock</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Save smarter with verified coupons, handpicked deals and trusted store offers.
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">About</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">Coupon Stock</h3>
            <div className="mb-3 text-lg font-extrabold text-white">MyCouponStock</div>
            <ul className="space-y-2.5">
              <li><Link href="/deals">All Coupons</Link></li>
            </ul>
            <p className="mt-4 text-[#9EABC6]">
              Your Trusted Coupon Stock Partner for Daily Savings
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">Global Coupons</h3>
            <ul className="space-y-2.5">
              <li><Link href="/country/global">Global Coupons</Link></li>
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
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">Social Media</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/mycouponstock/?_rdr" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2A3755] p-2 transition hover:border-[#425889] hover:text-white">
                <FaFacebookF />
              </a>
              <a href="https://x.com/mycouponstock" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2A3755] p-2 transition hover:border-[#425889] hover:text-white">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/mycouponstock/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2A3755] p-2 transition hover:border-[#425889] hover:text-white">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/mycouponstock/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2A3755] p-2 transition hover:border-[#425889] hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 text-[#A7B3CC]">
          <div>
            <h4 className="mb-2 font-semibold text-white">Popular Stores</h4>
            <div className="flex flex-wrap gap-2">
              {renderStoreLinks(grouped.popular)}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1B2741]"></div>

      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-[#8D9AB6]">
        © 2026 MyCouponStock. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
