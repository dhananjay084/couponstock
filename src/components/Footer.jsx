"use client";

import React from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  const sections = [
    { title: "Contact Us", link: "/contact" },
    { title: "About Us", link: "/about" },
    { title: "All Categories", link: "/allcategories" },
    { title: "All Offers", link: "/allcoupons" },
  ];

  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Accordion Sections */}
        {sections.map((section, index) => (
          <Link
            href={section.link}
            key={index}
            className="border-t border-gray-600 py-4 flex justify-between items-center cursor-pointer"
          >
            <span className="text-lg">{section.title}</span>
            <span className="text-xl">
              <MdKeyboardArrowRight />
            </span>
          </Link>
        ))}

        {/* Copyright Section */}
        <div className="text-center mt-8 text-gray-400">
          <p>© {new Date().getFullYear()}  All Rights Reserved</p>
          <div className="flex justify-center space-x-6 mt-3">
            <Link href="/terms" className="hover:text-white cursor-pointer ">Terms</Link>
            <Link href="/privacy" className="hover:text-white cursor-pointer">Privacy</Link>
            <Link href="/contact" className="hover:text-white cursor-pointer">Contact</Link>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="#" className="text-3xl text-gray-400 hover:text-white cursor-pointer">
            <FacebookIcon />
          </a>
          <a href="#" className="text-3xl text-gray-400 hover:text-white cursor-pointer">
            <TwitterIcon />
          </a>
          <a href="#" className="text-3xl text-gray-400 hover:text-white cursor-pointer">
            <InstagramIcon />
          </a>
          <a href="#" className="text-3xl text-gray-400 hover:text-white cursor-pointer">
            <YouTubeIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
