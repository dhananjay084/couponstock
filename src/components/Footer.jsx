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
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        
        {/* About */}
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

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">CATEGORIES</h3>
          <ul className="space-y-2">
            <li><Link href="/allcategories">All Categories</Link></li>
            {/* <li><Link href="/category">Category</Link></li> */}
            {/* <li><Link href="/allcoupons">Deals</Link></li> */}
            <li><Link href="/allcoupons">Coupons</Link></li>
          </ul>
        </div>

        {/* Stores */}
        <div>
          <h3 className="text-white font-semibold mb-4">STORES</h3>
          <ul className="space-y-2">
            <li><Link href="/allstores">All Stores</Link></li>
            {/* <li><Link href="/store">Store Page</Link></li> */}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-white font-semibold mb-4">ACCOUNT</h3>
          <ul className="space-y-2">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/signup">Signup</Link></li>
            {/* <li><Link href="/profilep">My Profile</Link></li>
            <li><Link href="/payment">Payment</Link></li> */}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} MyCouponStock. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
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
    </footer>
  );
};

export default Footer;
