"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 text-sm">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {/* Download App */}
        <div>
          <h3 className="text-white font-semibold mb-4">DOWNLOAD OUR APP</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:underline">
                Rakuten Mobile Apps
              </Link>
            </li>
            <li>
              <p className="text-gray-400">Available for iOS and Android</p>
            </li>
          </ul>
        </div>

        {/* Partner Sites */}
        <div>
          <h3 className="text-white font-semibold mb-4">PARTNER SITES</h3>
          <ul className="space-y-2">
            <li><Link href="#">Canada</Link></li>
            <li><Link href="#">Japan</Link></li>
            <li><Link href="#">Cartera</Link></li>
            <li><Link href="#">ShopStyle</Link></li>
            <li><Link href="#">Rakuten France</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4">ABOUT</h3>
          <ul className="space-y-2">
            <li><Link href="#">Getting Started</Link></li>
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Our New Name</Link></li>
            <li><Link href="#">Advertising & Partnerships</Link></li>
            <li><Link href="#">Influencers & Partners</Link></li>
            <li><Link href="#">Press Room</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Site Map</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Do Not Sell / Opt-out</Link></li>
            <li><Link href="#">Help</Link></li>
          </ul>
        </div>

        {/* Stores & Brands */}
        <div>
          <h3 className="text-white font-semibold mb-4">STORES & BRANDS</h3>
          <ul className="space-y-2">
            <li><Link href="#">Best Buy</Link></li>
            <li><Link href="#">Kohl’s</Link></li>
            <li><Link href="#">Lowe’s</Link></li>
            <li><Link href="#">Macy’s</Link></li>
            <li><Link href="#">Nordstrom</Link></li>
            <li><Link href="#">Old Navy</Link></li>
            <li><Link href="#">Priceline</Link></li>
            <li><Link href="#">Target</Link></li>
            <li><Link href="#">See All Brands</Link></li>
            <li><Link href="#">See All Stores</Link></li>
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">POPULAR CATEGORIES</h3>
          <ul className="space-y-2">
            <li><Link href="#">Baby & Toddler</Link></li>
            <li><Link href="#">Clothing</Link></li>
            <li><Link href="#">Accessories</Link></li>
            <li><Link href="#">Electronics</Link></li>
            <li><Link href="#">Travel & Vacations</Link></li>
            <li><Link href="#">Wellness & Beauty</Link></li>
            <li><Link href="#">Shoes</Link></li>
            <li><Link href="#">Home & Garden</Link></li>
            <li><Link href="#">Food, Drinks & Restaurant</Link></li>
          </ul>
        </div>

        {/* Tools & Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">TOOLS & SERVICES</h3>
          <ul className="space-y-2">
            <li><Link href="#">In-Store Cash Back</Link></li>
            <li><Link href="#">Rakuten American Express® Card</Link></li>
            <li><Link href="#">Rakuten Browser Extension</Link></li>
            <li><p className="text-gray-400">Available for Google Chrome</p></li>
          </ul>
        </div>

        {/* Seasonal Pages */}
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="text-white font-semibold mb-4">SEASONAL PAGES</h3>
          <ul className="space-y-2">
            <li><Link href="#">Black Friday</Link></li>
            <li><Link href="#">Cyber Monday</Link></li>
            <li><Link href="#">Green Monday</Link></li>
            <li><Link href="#">Holiday Gifts</Link></li>
            <li><Link href="#">Presidents Day Sales</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Ebates Performance Marketing, Inc., d/b/a Rakuten Rewards
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white"><FaTiktok /></a>
          <a href="#" className="hover:text-white"><FaFacebookF /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaYoutube /></a>
          <a href="#" className="hover:text-white"><FaPinterestP /></a>
          <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
