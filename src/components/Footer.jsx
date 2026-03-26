"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
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
              <li><Link href="/in">India Coupons</Link></li>
              <li><Link href="/us">USA Coupons</Link></li>
              <li><Link href="/uk">UK Coupons</Link></li>
              <li><Link href="/es">Spain Coupons</Link></li>
              <li><Link href="/de">Germany Coupons</Link></li>
              <li><Link href="/fr">France Coupons</Link></li>
              <li><Link href="/pt">Portugal Coupons</Link></li>
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
            <p>
              Libas, Zouk, Marks &amp; Spencer, Myntra Coupons, Beyoung, Ajio Deals,
              Boohoo, FirstCry Coupons, Superdry, Libas
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Beauty</h4>
            <p>
              Sephora, Mamaearth, Nykaa, Maybelline, Lakme, MAC Cosmetics,
              Maybelline, Mama Earth, Wow
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Travel</h4>
            <p>
              Air Asia, Booking.com, Qatar Airways, ITA Airways, Viator, Expedia,
              Klook, Trivago
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Food</h4>
            <p>
              Dominos, Swiggy Deals, Zomato Coupons, Myprotein, Good Monk,
              Pizza Hut Coupons
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Popular Stores</h4>
            <p>
              Croma, Amazon Coupons, Flipkart Coupons, NordVPN, DHGate,
              Decathlon, Meesho, Redbus
            </p>
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
