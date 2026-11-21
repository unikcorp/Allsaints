"use client";

import { useState, useMemo } from "react";
import type { SchoolVideo } from "@/types";

interface VideoGalleryClientProps {
  videos: SchoolVideo[];
}

const CATEGORIES = [
  "All",
  "Sports & Athletics",
  "Annual Day & Fests",
  "Campus Life & Ceremonies",
  "Clubs & Academics",
] as const;

export default function VideoGalleryClient({ videos }: VideoGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesCategory =
        selectedCategory === "All" || v.category === selectedCategory;
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { All: videos.length };
    videos.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [videos]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(12);
  };

  return (
    <div>
      {/* ─── Search & Category Filters ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = countsByCategory[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-serif font-bold tracking-wide transition-all ${
                  isSelected
                    ? "bg-[#6B0B2E] text-white shadow-xs"
                    : "bg-[#FAF2F5] text-slate-700 hover:bg-[#F3D5DD] hover:text-[#6B0B2E] border border-[#6B0B2E]/20"
                }`}
              >
                {cat} <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-full text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6B0B2E] focus:ring-1 focus:ring-[#6B0B2E]"
            />
            <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="text-xs text-slate-500 font-sans mb-6">
        Showing <span className="font-bold text-[#5C0620]">{displayedVideos.length}</span> of{" "}
        <span className="font-bold text-[#5C0620]">{filteredVideos.length}</span> videos
        {searchQuery && (
          <span> matching &ldquo;<span className="text-[#7A0C2E] font-semibold">{searchQuery}</span>&rdquo;</span>
        )}
      </div>

      {/* ─── Video Grid ─── */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-[#FFF5F7]/50 border border-[#F3C4D0] rounded-2xl">
          <p className="text-slate-500 text-sm">No videos found matching your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-bold text-[#7A0C2E] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {displayedVideos.map((v) => {
            const isPlaying = activeVideoId === v.id;
            return (
              <div
                key={v.id}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:border-[#7A0C2E] hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Video Container / Thumbnail Facade */}
                <div className="relative aspect-video w-full bg-slate-900 group">
                  {isPlaying ? (
                    v.localVideoPath ? (
                      <video
                        src={v.localVideoPath}
                        controls
                        autoPlay
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <iframe referrerPolicy="strict-origin-when-cross-origin"
                        src={`${v.embedUrl}?autoplay=1`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )
                  ) : (
                    <button
                      onClick={() => setActiveVideoId(v.id)}
                      className="w-full h-full relative block cursor-pointer group focus:outline-none"
                      aria-label={`Play ${v.title}`}
                    >
                      {/* High-res YouTube thumbnail with fallback */}
                      <img
                        src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                      {/* Play Button Badge in Maroon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#7A0C2E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#5C0620] transition-all">
                          <svg
                            className="w-6 h-6 translate-x-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        YouTube
                      </span>
                    </button>
                  )}
                </div>

                {/* Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A0C2E] bg-[#FFF5F7] border border-[#F3C4D0] px-2.5 py-0.5 rounded-full inline-block mb-2">
                      {v.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#5C0620] leading-snug line-clamp-2">
                      {v.title}
                    </h3>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-slate-400">All Saints Official</span>
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7A0C2E] hover:underline font-semibold flex items-center gap-1"
                    >
                      Watch on YouTube ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Load More Button ─── */}
      {displayedVideos.length < filteredVideos.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="bg-[#7A0C2E] hover:bg-[#5C0620] text-white px-8 py-3 rounded-full text-xs font-serif font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
          >
            Load More Videos ({filteredVideos.length - displayedVideos.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
