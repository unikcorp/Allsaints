"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EditableNews,
  DEFAULT_NEWS,
  getStoredNews,
} from "@/utils/adminStorage";
import { apiGetNews } from "@/utils/apiService";

interface CampusSlide {
  image: string;
  title: string;
  caption: string;
}

const HERO_CAMPUS_SLIDES: CampusSlide[] = [
  {
    image: "/images/home_slider/slider-1.jpg",
    title: "All Saints Public School Campus",
    caption: "CBSE Affiliated (930501) · LKG to Class XII · Pannivizha, Adoor",
  },
  {
    image: "/images/home_slider/slider-2.jpg",
    title: "Eco-Friendly Lush Green Grounds",
    caption: "Spacious Campus, Play Arenas & High-Tech Smart Classrooms",
  },
  {
    image: "/images/home_slider/slider-3.jpg",
    title: "Nurturing Mind, Body & Spirit",
    caption: "To Create Creators · Holistic Academic & Moral Excellence",
  },
  {
    image: "/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg",
    title: "State-of-the-Art Infrastructure",
    caption: "Future-Ready Learning with 100% CBSE Success Record",
  },
];

export default function Hero() {
  const [campusSlide, setCampusSlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);
  const [isCampusPaused, setIsCampusPaused] = useState(false);
  const [isNewsPaused, setIsNewsPaused] = useState(false);
  const [newsList, setNewsList] = useState<EditableNews[]>(DEFAULT_NEWS);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setNewsList(getStoredNews());
    apiGetNews().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: EditableNews[] = data.map((n: any) => ({
          id: String(n.id),
          title: n.title,
          date: n.publish_date,
          category: n.category,
          excerpt: n.excerpt,
          image: n.image_url || "",
          videoUrl: n.video_url || "",
          isFeatured: Boolean(n.is_featured),
          published: Boolean(n.is_published),
        }));
        setNewsList(mapped);
      }
    });
  }, []);

  // Campus background slider handlers
  const nextCampusSlide = useCallback(() => {
    setCampusSlide((prev) => (prev + 1) % HERO_CAMPUS_SLIDES.length);
  }, []);

  const prevCampusSlide = useCallback(() => {
    setCampusSlide((prev) => (prev - 1 + HERO_CAMPUS_SLIDES.length) % HERO_CAMPUS_SLIDES.length);
  }, []);

  // Daily News slider handlers
  const nextNewsSlide = useCallback(() => {
    setNewsSlide((prev) => (prev + 1) % (newsList.length || 1));
  }, [newsList.length]);

  const prevNewsSlide = useCallback(() => {
    setNewsSlide((prev) => (prev - 1 + (newsList.length || 1)) % (newsList.length || 1));
  }, [newsList.length]);

  // Automatic scrolling for Campus Carousel (every 4.5 seconds)
  useEffect(() => {
    if (isCampusPaused) return;
    const interval = setInterval(() => {
      nextCampusSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [nextCampusSlide, isCampusPaused]);

  // Automatic scrolling for Daily News
  useEffect(() => {
    if (isNewsPaused) return;
    const interval = setInterval(() => {
      nextNewsSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [nextNewsSlide, isNewsPaused]);

  // Touch Swipe support for Campus Carousel
  const [campusTouchStartX, setCampusTouchStartX] = useState<number | null>(null);

  const handleCampusTouchStart = (e: React.TouchEvent) => {
    setCampusTouchStartX(e.targetTouches[0].clientX);
  };

  const handleCampusTouchEnd = (e: React.TouchEvent) => {
    if (campusTouchStartX === null) return;
    const diff = campusTouchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextCampusSlide();
    } else if (diff < -40) {
      prevCampusSlide();
    }
    setCampusTouchStartX(null);
  };

  // Swipe / Drag support for horizontal movement inside news panel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextNewsSlide();
    } else if (diff < -40) {
      prevNewsSlide();
    }
    setTouchStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;
    const diff = mouseStartX - e.clientX;
    if (diff > 40) {
      nextNewsSlide();
    } else if (diff < -40) {
      prevNewsSlide();
    }
    setMouseStartX(null);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white border-b border-[#D8EAF8] flex flex-col lg:flex-row items-stretch"
      aria-label="All Saints Public School Campus Showcase"
    >
      {/* ─── LEFT COLUMN: EXACTLY 2/3 CAROUSEL (66.666%) ──────────────── */}
      <div
        className="relative w-full lg:w-[66.666%] lg:basis-[66.666%] flex-shrink-0 h-[60vh] min-h-[460px] sm:min-h-[520px] lg:h-auto lg:min-h-[640px] xl:min-h-[700px] overflow-hidden select-none"
        onMouseEnter={() => setIsCampusPaused(true)}
        onMouseLeave={() => setIsCampusPaused(false)}
        onTouchStart={handleCampusTouchStart}
        onTouchEnd={handleCampusTouchEnd}
      >
        {/* Full Image Slider Track (Cover, full height, no white fade, no blur) */}
        <div
          className="absolute inset-0 flex h-full w-full transition-transform duration-700 ease-in-out z-0"
          style={{ transform: `translateX(-${campusSlide * 100}%)` }}
        >
          {HERO_CAMPUS_SLIDES.map((slide, index) => (
            <div key={slide.image} className="relative h-full w-full flex-shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                unoptimized
                quality={100}
                className="object-cover object-center select-none"
                sizes="(max-width: 1024px) 100vw, 67vw"
              />
            </div>
          ))}
        </div>

        {/* Dark-Blue Gradient (Only bottom ~40% so the top 60% stays 100% clear) */}
        <div className="absolute inset-x-0 bottom-0 h-[44%] md:h-[40%] bg-gradient-to-t from-[#092F78]/95 via-[#092F78]/65 to-transparent pointer-events-none z-10" />

        {/* Round Blue Previous Button (44px, vertically centered) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevCampusSlide();
          }}
          aria-label="Previous Campus Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0875C9] hover:bg-[#0066B5] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer z-20 border border-white/20"
        >
          <svg className="w-5 h-5 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Round Blue Next Button (44px, vertically centered) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextCampusSlide();
          }}
          aria-label="Next Campus Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0875C9] hover:bg-[#0066B5] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer z-20 border border-white/20"
        >
          <svg className="w-5 h-5 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Welcome Content Overlay (Positioned at bottom-left in white text) */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 lg:p-12 z-10 max-w-2xl pointer-events-auto">
          {/* "Welcome to" with Golden Underline Swoosh */}
          <div className="inline-block mb-1 sm:mb-1.5 animate-welcome-badge">
            <span className="font-['Dancing_Script',cursive,serif] italic text-3xl sm:text-4xl md:text-[42px] lg:text-[44px] text-white font-bold tracking-wide leading-none inline-block select-none drop-shadow-sm">
              <span className="inline-block whitespace-nowrap">
                {"Welcome".split("").map((char, i) => (
                  <span key={i} className="movable-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                    {char}
                  </span>
                ))}
              </span>
              <span> </span>
              <span className="inline-block whitespace-nowrap">
                {"to".split("").map((char, i) => (
                  <span key={i} className="movable-letter" style={{ animationDelay: `${(7 + i) * 0.08}s` }}>
                    {char}
                  </span>
                ))}
              </span>
            </span>
            <svg
              className="w-28 sm:w-36 md:w-44 h-2.5 sm:h-3 text-[#FFB900] mt-0.5 sm:mt-1 animate-swoosh"
              viewBox="0 0 160 12"
              fill="none"
            >
              <path
                d="M2 8C50 2 110 2 158 8"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* School Name Headline (White Serif font) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-serif font-black text-white tracking-tight leading-[1.08] mb-2 sm:mb-3 drop-shadow-sm select-none">
            <span className="inline-block whitespace-nowrap">
              {"All".split("").map((char, i) => (
                <span key={i} className="movable-letter" style={{ animationDelay: `${i * 0.06}s` }}>
                  {char}
                </span>
              ))}
            </span>
            <span> </span>
            <span className="inline-block whitespace-nowrap">
              {"Saints".split("").map((char, i) => (
                <span key={i} className="movable-letter" style={{ animationDelay: `${(3 + i) * 0.06}s` }}>
                  {char}
                </span>
              ))}
            </span>
            <span> </span>
            <span className="inline-block whitespace-nowrap">
              {"Public".split("").map((char, i) => (
                <span key={i} className="movable-letter" style={{ animationDelay: `${(9 + i) * 0.06}s` }}>
                  {char}
                </span>
              ))}
            </span>
            <br className="hidden sm:inline" />
            <span className="hidden sm:inline"> </span>
            <span className="inline-block whitespace-nowrap">
              {"School".split("").map((char, i) => (
                <span key={i} className="movable-letter" style={{ animationDelay: `${(15 + i) * 0.06}s` }}>
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Motto with Golden Dots: Learn • Grow • Excel */}
          <div className="flex items-center gap-2.5 text-base sm:text-xl lg:text-[22px] font-serif font-bold text-white mb-3 sm:mb-4 drop-shadow-xs">
            <span>Learn</span>
            <span className="w-2 h-2 rounded-full bg-[#FFB900]" />
            <span>Grow</span>
            <span className="w-2 h-2 rounded-full bg-[#FFB900]" />
            <span>Excel</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5">
            <Link
              href="/online_admission"
              className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-bold tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <span>Admission Enquiry</span>
              <span className="text-base">&rarr;</span>
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EAF6FF] text-[#092F78] hover:text-[#0875C9] border-2 border-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-bold tracking-wide shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <span className="text-xs text-[#0875C9]">▶</span>
              <span>Watch Our School</span>
            </Link>
          </div>
        </div>

        {/* Small Dot Indicators (Bottom Center of Carousel, active is solid white) */}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {HERO_CAMPUS_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCampusSlide(i)}
              aria-label={`Campus slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === campusSlide
                  ? "w-6 bg-white shadow-xs"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: EXACTLY 1/3 (33.333%) PLAIN WHITE DAILY NEWS PANEL ─── */}
      <div
        className="w-full lg:w-[33.333%] lg:basis-[33.333%] flex-shrink-0 bg-white flex flex-col justify-between box-border px-6 sm:px-8 lg:pt-[24px] lg:pb-[26px] lg:pl-[34px] lg:pr-[80px] py-6 sm:py-7 select-none relative z-10 min-w-0 h-auto lg:h-full"
        onMouseEnter={() => setIsNewsPaused(true)}
        onMouseLeave={() => setIsNewsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        aria-label="Daily News Bulletin"
      >
        {/* Header Row: DAILY NEWS badge with "All News →" link on right */}
        <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3 flex-shrink-0 min-w-0 w-full">
          <div className="inline-flex items-center gap-1.5 bg-[#092F78] text-white text-[11px] font-sans font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs flex-shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M21 4.25a.75.75 0 00-.75-.75H17a1 1 0 00-1 1v1.5a1 1 0 001 1h.5v6.5h-.5a1 1 0 00-1 1v1.5a1 1 0 001 1h3.25a.75.75 0 00.75-.75V4.25zM14 6H7.83a3 3 0 00-2.12.88L3.29 9.3A1 1 0 003 10v4a1 1 0 00.29.71l2.42 2.41A3 3 0 007.83 18H14V6z" />
            </svg>
            <span>DAILY NEWS</span>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-sans font-bold text-[#092F78] hover:text-[#0875C9] transition-colors flex-shrink-0"
          >
            <span>All News</span>
            <span className="text-sm font-bold">&rarr;</span>
          </Link>
        </div>

        {/* Middle Slider Track (Moves horizontally inside panel) */}
        <div className="w-full overflow-hidden min-w-0 flex-1 flex flex-col justify-center my-1 sm:my-2 lg:my-0 cursor-grab active:cursor-grabbing">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${(newsList.length || 1) * 100}%`,
              transform: `translateX(-${(newsSlide * 100) / (newsList.length || 1)}%)`,
            }}
          >
            {newsList.map((item, index) => {
              let displayDate = item.date || "20-05-2026";
              if (item.date) {
                try {
                  const d = new Date(item.date);
                  if (!isNaN(d.getTime())) {
                    const day = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const year = d.getFullYear();
                    displayDate = `${day}-${month}-${year}`;
                  }
                } catch {
                  const rawDate = item.date.includes("T") ? item.date.split("T")[0] : item.date;
                  displayDate = rawDate;
                }
              }
              const newsImg =
                item.image && !brokenImages[item.id || index]
                  ? item.image
                  : "/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg";

              return (
                <div
                  key={item.id || index}
                  className="flex-shrink-0 min-w-0 flex flex-col box-border gap-2 sm:gap-2.5"
                  style={{ width: `${100 / (newsList.length || 1)}%` }}
                >
                  {/* News Image: 100% completely visible and readable with object-contain */}
                  <div className="relative w-full h-44 sm:h-52 lg:h-48 xl:h-52 rounded-[20px] overflow-hidden border border-[#D8EAF8] bg-gradient-to-b from-[#F4FAFF] to-[#EAF6FF] flex items-center justify-center flex-shrink-0">
                    {/* Ambient soft backdrop */}
                    <Image
                      src={newsImg}
                      alt=""
                      fill
                      className="object-cover blur-md scale-110 opacity-30 pointer-events-none select-none"
                      unoptimized
                      aria-hidden="true"
                    />
                    {/* Uncropped poster - all text, headlines, and details 100% completely legible */}
                    <Image
                      src={newsImg}
                      alt={item.title}
                      fill
                      className="object-contain relative z-10 p-1 select-none drop-shadow-xs"
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 420px"
                      onError={() => setBrokenImages((prev) => ({ ...prev, [item.id || index]: true }))}
                    />
                  </div>

                  {/* Meta Row: date chip & category chip */}
                  <div className="flex items-center gap-2 flex-wrap min-w-0 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#0875C9] font-sans font-bold bg-[#EAF4FF] px-2.5 py-1 rounded-md flex-shrink-0">
                      <span>🗓️</span>
                      <span>{displayDate}</span>
                    </span>
                    <span className="inline-flex items-center text-[10px] sm:text-[11px] font-sans font-black text-[#B81D24] bg-[#FDF2F2] border border-[#FCDAD7] px-2.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                      {item.category || "OFFICIAL NOTICE"}
                    </span>
                  </div>

                  {/* Title: bold navy, completely legible without clipping */}
                  <h3 className="text-[#092F78] font-sans font-bold text-base sm:text-lg lg:text-lg xl:text-xl leading-snug tracking-tight [overflow-wrap:anywhere] break-words min-w-0 line-clamp-2">
                    <Link href="/news" className="hover:text-[#0875C9] transition-colors">
                      {item.title}
                    </Link>
                  </h3>

                  {/* Description: gray, line-height 1.6, up to 3 lines */}
                  <p className="text-slate-600 font-sans text-xs sm:text-[13px] lg:text-[13px] xl:text-[13.5px] leading-relaxed line-clamp-3 [overflow-wrap:anywhere] break-words font-normal min-w-0">
                    {item.excerpt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Row: pinned to the bottom */}
        <div className="flex items-center justify-between gap-3 pt-2.5 sm:pt-3 border-t border-slate-100 flex-shrink-0 w-full min-w-0">
          {/* Blue pill "Read More →" button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs sm:text-sm font-sans font-bold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <span>Read More</span>
            <span className="text-sm font-bold">&rarr;</span>
          </Link>

          {/* Dot indicators on the right (only if the news list rotates; if only one item, omit dots) */}
          {newsList.length > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end" aria-label="News slide pagination">
              {newsList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewsSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === newsSlide
                      ? "w-6 bg-[#0875C9] shadow-xs"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
