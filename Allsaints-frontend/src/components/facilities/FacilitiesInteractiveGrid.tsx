"use client";

import React, { useState } from "react";
import type { Facility } from "@/types";
import FacilityIcon from "@/components/ui/FacilityIcon";
import FacilityDetailModal from "@/components/ui/FacilityDetailModal";

interface FacilitiesInteractiveGridProps {
  facilities: Facility[];
  statusLabel?: string;
  initialLimit?: number;
}

export default function FacilitiesInteractiveGrid({
  facilities,
  statusLabel = "CBSE Compliant Infrastructure",
  initialLimit = 3,
}: FacilitiesInteractiveGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Show only 3 cards initially, or all when expanded
  const visibleFacilities = showAll ? facilities : facilities.slice(0, initialLimit);

  return (
    <>
      {/* 3-Column Facilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleFacilities.map((facility) => (
          <div
            key={facility.id}
            onClick={() => setSelectedFacility(facility)}
            className="p-6 bg-white border border-[#D8EAF8] shadow-xs hover:border-[#0875C9] hover:shadow-md transition-all rounded-2xl group flex flex-col justify-between cursor-pointer animate-in fade-in duration-200"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#0875C9] group-hover:bg-[#0875C9] group-hover:text-white transition-colors flex items-center justify-center mb-4 border border-[#D8EAF8] shadow-2xs">
                <FacilityIcon id={facility.id} name={facility.name} className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#092F78] mb-2 tracking-tight">
                {facility.name}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-sans leading-relaxed mb-4">
                {facility.description}
              </p>
            </div>
            <div className="border-t border-[#D8EAF8] pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0875C9] flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
                {statusLabel}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFacility(facility);
                }}
                className="text-xs font-bold text-[#0875C9] hover:text-[#092F78] flex items-center gap-1 group-hover:translate-x-0.5 transition-all font-sans cursor-pointer"
                aria-label={`View more details about ${facility.name}`}
              >
                View More
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "View More" Toggle Button to Expand / Show All 9 Cards */}
      {facilities.length > initialLimit && (
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-white hover:bg-[#EAF6FF] text-[#0875C9] border-2 border-[#0875C9] font-sans font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <span>{showAll ? "View Less" : "View More"}</span>
            <svg
              className={`w-4 h-4 text-[#0875C9] transition-transform duration-200 ${
                showAll ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Individual Facility Detail Lightbox Modal */}
      <FacilityDetailModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </>
  );
}
