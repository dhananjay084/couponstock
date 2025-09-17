"use client";
import Link from "next/link";

export default function BrandDirectory({ heading = "Top Stories : Brand Directory", data = [] }) {
  return (
    <section className="w-full bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {heading}
        </h2>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item, index) => (
            <div key={index}>
              <h3 className="text-gray-800 font-semibold mb-3">
                {item.category}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {item.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="hover:text-[#592EA9] transition-colors duration-200"
                  >
                    {link.text}
                    {i < item.links.length - 1 && <span className="mx-1">|</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
