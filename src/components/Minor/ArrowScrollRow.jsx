"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const baseButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-[#D7DCE3] bg-white text-[#1B2436] shadow-sm transition hover:border-[#C7CCD6] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40";

function getScrollState(element) {
  if (!element) return { hasOverflow: false, canLeft: false, canRight: false };
  const hasOverflow = element.scrollWidth - element.clientWidth > 2;
  if (!hasOverflow) return { hasOverflow, canLeft: false, canRight: false };

  const left = element.scrollLeft;
  const rightEdge = left + element.clientWidth;
  const maxRight = element.scrollWidth;

  return {
    hasOverflow,
    canLeft: left > 1,
    canRight: maxRight - rightEdge > 1,
  };
}

export default function ArrowScrollRow({
  className = "",
  controlsClassName = "",
  scrollerClassName = "",
  buttonClassName = "",
  scrollAmount,
  ariaLabelPrev = "Scroll left",
  ariaLabelNext = "Scroll right",
  children,
}) {
  const scrollerRef = useRef(null);
  const [scrollState, setScrollState] = useState(() => getScrollState(null));

  const buttonClasses = useMemo(() => {
    const size = "h-11 w-11 text-2xl leading-none";
    return `${baseButtonClassName} ${size} ${buttonClassName}`.trim();
  }, [buttonClassName]);

  const updateScrollState = () => {
    setScrollState(getScrollState(scrollerRef.current));
  };

  useEffect(() => {
    updateScrollState();
    const element = scrollerRef.current;
    if (!element) return;

    const onScroll = () => updateScrollState();
    element.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByDirection = (direction) => {
    const element = scrollerRef.current;
    if (!element) return;
    const amount = typeof scrollAmount === "number" ? scrollAmount : Math.max(element.clientWidth * 0.85, 280);
    element.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className={className}>
      {scrollState.hasOverflow && (
        <div className={`mb-2 flex items-center justify-end gap-3 pr-1 ${controlsClassName}`.trim()}>
          <button
            type="button"
            aria-label={ariaLabelPrev}
            className={buttonClasses}
            onClick={() => scrollByDirection(-1)}
            disabled={!scrollState.canLeft}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={ariaLabelNext}
            className={buttonClasses}
            onClick={() => scrollByDirection(1)}
            disabled={!scrollState.canRight}
          >
            ›
          </button>
        </div>
      )}

      <div
        ref={scrollerRef}
        className={`overflow-x-auto scroll-smooth scrollbar-hide ${scrollerClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

