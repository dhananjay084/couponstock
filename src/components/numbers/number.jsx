"use client";
import { useEffect, useRef, useState } from "react";

export default function NumberStats({ stats, heading = "Our Impact in Numbers" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // CountUp Component
  const CountUp = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!visible) return;

      let start = 0;
      const end = parseInt(target.replace(/\D/g, "")); // extract digits
      const suffix = target.replace(/[0-9]/g, ""); // keep +, M, etc.

      const duration = 1000; // 1 second (fast but smooth)
      const step = Math.ceil(end / (duration / 16)); // ~60fps

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [visible, target]);

    return (
      <span>
        {count}
        {target.replace(/[0-9]/g, "")}
      </span>
    );
  };

  return (
    <section ref={ref} className="w-full py-16 bg-gray-50 px-4">
      {/* Heading */}
      <h1
        className="text-center text-3xl md:text-4xl font-bold mb-12 tracking-wide"
        style={{ color: "#592EA9" }}
      >
        {heading}
      </h1>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <h2
              className="text-3xl md:text-4xl font-extrabold"
              style={{ color: "#592EA9" }}
            >
              {visible ? <CountUp target={item.number} /> : "0"}
            </h2>
            <p className="text-gray-700 mt-3 text-base font-medium">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
