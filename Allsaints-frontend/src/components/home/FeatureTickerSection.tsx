"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredNews } from "@/utils/adminStorage";

interface FeatureItem {
  icon: (props: { className?: string }) => JSX.Element;
  title: string;
  subtitle: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "Academic Excellence",
    subtitle: "100% Success in CBSE XII",
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
      </svg>
    ),
  },
  {
    title: "Holistic Development",
    subtitle: "Beyond Academics",
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M6 4h12v4a6 6 0 01-12 0V4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7H4a2 2 0 00-2 2v1a4 4 0 004 4h0M18 7h2a2 2 0 012 2v1a4 4 0 01-4 4h0" />
      </svg>
    ),
  },
  {
    title: "Nurturing Values",
    subtitle: "For a Better Tomorrow",
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "State-of-the-Art Facilities",
    subtitle: "For Complete Learning",
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

const NEWS_TICKER_ITEMS = [
  "20 May 2026 – Triumph of Excellence: Class XII CBSE Results 2026",
  "30 April 2026 – Class X CBSE Results 2026: A Legacy of Academic Excellence Continued",
  "Admissions Open for Pre-Primary to Class XII (Session 2026-27)",
  "CBSE Results 2026 – 100% Success across Science & Commerce Streams",
  "Annual Sports Day 2026 – Grand Success & Medal Distribution",
  "New Academic Session Begins from June 2026",
  "School Library Extended Hours & Digital Resource Center Opened",
];

export default function FeatureTickerSection() {
  const [tickerItems, setTickerItems] = useState<string[]>(NEWS_TICKER_ITEMS);

  useEffect(() => {
    const updateTicker = () => {
      try {
        const stored = getStoredNews();
        if (stored && stored.length > 0) {
          const published = stored.filter((n) => n.published !== false);
          if (published.length > 0) {
            setTickerItems(published.map((n) => `${n.date} – ${n.title}`));
          }
        }
      } catch {}
    };

    updateTicker();
    if (typeof window !== "undefined") {
      window.addEventListener("school-news-updated", updateTicker);
      return () => window.removeEventListener("school-news-updated", updateTicker);
    }
  }, []);

  return (
    <div className="relative z-20 -mt-4 sm:-mt-6 lg:-mt-8 mb-8 sm:mb-12">
      <div className="container-custom">
        {/* ─── 1. Floating 4-Feature Strip Matching Mockup ────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#D8EAF8] p-4 sm:p-6 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D8EAF8]">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex items-center gap-4 ${
                  i === 0 ? "" : "sm:pl-6 pt-3 sm:pt-0"
                }`}
              >
                {/* Blue Circular Icon */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#BFE3FF] flex-shrink-0 flex items-center justify-center shadow-sm">
                  <feature.icon className="w-7 h-7 text-[#0875C9]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#092F78] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 2. Horizontal Daily News Ticker Bar (Automatically Scrolling) ── */}
        <div className="bg-[#EAF6FF] border border-[#D8EAF8] rounded-full p-1.5 sm:p-2 flex items-center shadow-xs overflow-hidden">
          
          {/* Daily News Badge */}
          <div className="flex-shrink-0 bg-[#092F78] text-white font-serif font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 shadow-xs select-none z-10">
            <span className="text-sm">📢</span>
            <span className="tracking-wide uppercase">Daily News</span>
          </div>

          {/* Continuous Horizontally Scrolling Marquee */}
          <div className="flex-1 overflow-hidden relative mx-3 py-1 select-none">
            <div className="animate-marquee-horizontal flex items-center whitespace-nowrap">
              <div className="flex items-center gap-8 pr-8 text-xs sm:text-sm font-sans text-slate-800 font-medium">
                {tickerItems.map((item, idx) => (
                  <div key={`n1-${idx}`} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FFB900] flex-shrink-0" />
                    <Link
                      href="/news"
                      className="hover:text-[#0875C9] hover:underline transition-colors"
                    >
                      {item}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-8 pr-8 text-xs sm:text-sm font-sans text-slate-800 font-medium" aria-hidden="true">
                {tickerItems.map((item, idx) => (
                  <div key={`n2-${idx}`} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FFB900] flex-shrink-0" />
                    <Link
                      href="/news"
                      className="hover:text-[#0875C9] hover:underline transition-colors"
                    >
                      {item}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
