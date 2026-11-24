"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EditableNews,
  DEFAULT_NEWS,
  getStoredNews,
  isAdminAuthenticated,
} from "@/utils/adminStorage";
import {
  apiGetNews,
  apiGetHeroSlides,
  apiSaveHeroSlide,
  apiDeleteHeroSlide,
  apiUploadFile,
  EditableHeroSlide,
} from "@/utils/apiService";

interface CampusSlide {
  id?: number | string;
  image: string;
  title: string;
  caption: string;
  display_order?: number;
}

const DEFAULT_CAMPUS_SLIDES: CampusSlide[] = [
  {
    id: 1,
    image: "/images/home_slider/slider-1.jpg",
    title: "All Saints Public School Campus",
    caption: "CBSE Affiliated (930501) · LKG to Class XII · Pannivizha, Adoor",
    display_order: 1,
  },
  {
    id: 2,
    image: "/images/home_slider/slider-2.jpg",
    title: "Eco-Friendly Lush Green Grounds",
    caption: "Spacious Campus, Play Arenas & High-Tech Smart Classrooms",
    display_order: 2,
  },
  {
    id: 3,
    image: "/images/home_slider/slider-3.jpg",
    title: "Nurturing Mind, Body & Spirit",
    caption: "To Create Creators · Holistic Academic & Moral Excellence",
    display_order: 3,
  },
  {
    id: 4,
    image: "/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg",
    title: "State-of-the-Art Infrastructure",
    caption: "Future-Ready Learning with 100% CBSE Success Record",
    display_order: 4,
  },
];

export default function Hero() {
  const [campusSlide, setCampusSlide] = useState(0);
  const [campusSlides, setCampusSlides] = useState<CampusSlide[]>(DEFAULT_CAMPUS_SLIDES);
  const [newsSlide, setNewsSlide] = useState(0);
  const [isCampusPaused, setIsCampusPaused] = useState(false);
  const [isNewsPaused, setIsNewsPaused] = useState(false);
  const [newsList, setNewsList] = useState<EditableNews[]>(DEFAULT_NEWS);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // ─── ADMIN EDIT STATE ───────────────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [modalView, setModalView] = useState<"list" | "form">("list");
  const [editingSlideId, setEditingSlideId] = useState<number | string | null>(null);
  const [slideFormData, setSlideFormData] = useState({
    image_url: "",
    display_order: 1,
  });
  const [uploadFileName, setUploadFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load live slides from database
  const loadHeroSlides = useCallback(async () => {
    try {
      const live = await apiGetHeroSlides();
      if (live && Array.isArray(live) && live.length > 0) {
        const mapped: CampusSlide[] = live.map((s: any) => ({
          id: s.id,
          image: s.image_url,
          title: s.title || "All Saints Public School Campus",
          caption: s.caption || "",
          display_order: s.display_order || 1,
        }));
        setCampusSlides(mapped);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    loadHeroSlides();

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
  }, [loadHeroSlides]);

  // Campus background slider handlers
  const nextCampusSlide = useCallback(() => {
    setCampusSlide((prev) => (prev + 1) % (campusSlides.length || 1));
  }, [campusSlides.length]);

  const prevCampusSlide = useCallback(() => {
    setCampusSlide((prev) => (prev - 1 + (campusSlides.length || 1)) % (campusSlides.length || 1));
  }, [campusSlides.length]);

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

  // Admin Slide Handlers
  const handleOpenAdd = () => {
    setEditingSlideId(null);
    setSlideFormData({
      image_url: "",
      display_order: campusSlides.length + 1,
    });
    setUploadFileName("");
    setModalError("");
    setModalView("form");
  };

  const handleOpenEdit = (slide: CampusSlide) => {
    setEditingSlideId(slide.id || null);
    setSlideFormData({
      image_url: slide.image,
      display_order: slide.display_order || 1,
    });
    setUploadFileName("");
    setModalError("");
    setModalView("form");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setModalError("");
    setUploadFileName(file.name);
    try {
      const res = await apiUploadFile(file);
      if (res && res.success && res.url) {
        setSlideFormData((prev) => ({ ...prev, image_url: res.url }));
      } else {
        setModalError(res?.error || "Failed to upload file");
      }
    } catch (err: any) {
      setModalError(err?.message || "File upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormData.image_url.trim()) {
      setModalError("Please choose and upload an image file.");
      return;
    }
    setIsSaving(true);
    setModalError("");
    try {
      const payload: EditableHeroSlide = {
        id: editingSlideId || undefined,
        image_url: slideFormData.image_url.trim(),
        title: "All Saints Public School Campus",
        caption: "",
        display_order: Number(slideFormData.display_order) || 1,
        is_active: 1,
      };
      const res = await apiSaveHeroSlide(payload);
      if (res && res.status === "success") {
        setToastMessage(editingSlideId ? "Slide photo updated successfully!" : "New slide photo added!");
        await loadHeroSlides();
        setModalView("list");
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setModalError(res?.message || "Failed to save slide");
      }
    } catch (err: any) {
      setModalError(err?.message || "Network error while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlide = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this campus slider photo?")) return;
    try {
      const res = await apiDeleteHeroSlide(id);
      if (res && res.status === "success") {
        setToastMessage("Hero slide deleted successfully.");
        await loadHeroSlides();
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(res?.message || "Failed to delete slide");
      }
    } catch (err: any) {
      alert(err?.message || "Error deleting slide");
    }
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
        {/* Admin Management Trigger Button (Only visible to authenticated administrators) */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setModalView("list");
              setShowManageModal(true);
            }}
            className="absolute top-4 left-4 z-30 inline-flex items-center gap-1.5 bg-[#FFB900] hover:bg-[#E0A300] text-[#092F78] text-xs font-sans font-bold px-3.5 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/50"
            title="Administrator: Manage Campus Photos"
          >
            <span>✏️</span>
            <span>Edit Hero Photos</span>
          </button>
        )}

        {/* Full Image Slider Track (Cover, full height, no white fade, no blur) */}
        <div
          className="absolute inset-0 flex h-full w-full transition-transform duration-700 ease-in-out z-0"
          style={{ transform: `translateX(-${campusSlide * 100}%)` }}
        >
          {campusSlides.map((slide, index) => (
            <div key={slide.id || slide.image} className="relative h-full w-full flex-shrink-0">
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
          {campusSlides.map((_, i) => (
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

      {/* ─── ADMIN HERO SLIDES MANAGEMENT MODAL ───────────────────────── */}
      {isAdmin && showManageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#092F78] text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="font-serif font-bold text-lg">Manage Hero Campus Slider Photos</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-lg"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <span>✓</span>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              {modalView === "list" ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-slate-500">
                      These photos rotate automatically in the homepage hero carousel. You can add, edit, or delete slides.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer flex-shrink-0"
                    >
                      <span>+ Add New Slide</span>
                    </button>
                  </div>

                  {/* List of current slides */}
                  <div className="space-y-3">
                    {campusSlides.map((slide, idx) => (
                      <div
                        key={slide.id || idx}
                        className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-[#0875C9] transition-all bg-[#F8FAFC]"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
                          <Image
                            src={slide.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* Slide Info */}
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-xs font-bold bg-[#EAF4FF] text-[#0875C9] px-2.5 py-0.5 rounded-full mb-1">
                            Slide #{slide.display_order || idx + 1}
                          </span>
                          <p className="text-xs text-slate-500 truncate font-mono">
                            {slide.image}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(slide)}
                            className="text-[#0875C9] hover:bg-[#EAF4FF] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Change this photo"
                          >
                            ✏️ Change Photo
                          </button>
                          {slide.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSlide(slide.id!)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Delete this photo"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSaveSlide} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-base text-[#092F78]">
                      {editingSlideId ? "Change Slide Photo" : "Upload New Campus Photo"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setModalView("list")}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      &larr; Back to List
                    </button>
                  </div>

                  {modalError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{modalError}</span>
                    </div>
                  )}

                  {/* Image Upload Only */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#092F78] mb-2">
                      Choose Photo *
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-5 py-3 border-2 border-dashed border-[#0875C9] bg-[#EAF4FF] hover:bg-[#D9EEFF] text-[#0875C9] rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <span>📤</span>
                        <span>{isUploading ? "Uploading Image..." : "Choose Image File from Computer"}</span>
                      </button>
                      {uploadFileName && (
                        <span className="text-xs text-slate-600 font-medium truncate max-w-xs">
                          {uploadFileName}
                        </span>
                      )}
                    </div>

                    {/* Preview Image */}
                    {slideFormData.image_url && (
                      <div className="mt-4">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Photo Preview:
                        </p>
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                          <Image
                            src={slideFormData.image_url}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Footer */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalView("list")}
                      className="px-5 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !slideFormData.image_url}
                      className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {isSaving ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Slide Photo</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
