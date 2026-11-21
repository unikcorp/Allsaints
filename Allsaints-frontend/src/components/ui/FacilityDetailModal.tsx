"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import type { Facility } from "@/types";
import FacilityIcon from "@/components/ui/FacilityIcon";

interface FacilityDetailModalProps {
  facility: Facility | null;
  onClose: () => void;
}

export default function FacilityDetailModal({ facility, onClose }: FacilityDetailModalProps) {
  useEffect(() => {
    if (!facility) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [facility, onClose]);

  if (!facility) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#092F78]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#D8EAF8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8EAF8] bg-[#F4FAFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center border border-[#D8EAF8] shadow-xs shrink-0">
              <FacilityIcon id={facility.id} name={facility.name} className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0875C9] flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
                Campus Infrastructure
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#092F78] leading-tight">
                {facility.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#EAF6FF] text-slate-500 hover:text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-5 font-sans">
          {/* Facility Photo if present */}
          {facility.image && (
            <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-[#D8EAF8] shadow-xs">
              <Image
                src={facility.image}
                alt={facility.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#0875C9]/90 rounded-md backdrop-blur-xs">
                  All Saints Public School Campus
                </span>
              </div>
            </div>
          )}

          {/* Detailed Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0875C9] mb-1.5">
              Overview &amp; Facilities
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {facility.detailedDescription || facility.description}
            </p>
          </div>

          {/* Key Amenities / Features */}
          {facility.features && facility.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0875C9] mb-2.5">
                Key Highlights &amp; Equipment
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {facility.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F4FAFF] border border-[#D8EAF8] text-xs text-slate-700"
                  >
                    <svg
                      className="w-4 h-4 text-[#0875C9] shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Grid */}
          {facility.specs && facility.specs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0875C9] mb-2.5">
                Specifications &amp; Standards
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {facility.specs.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#D8EAF8] text-center shadow-2xs">
                    <span className="block text-[11px] font-medium text-slate-500 mb-0.5">
                      {item.label}
                    </span>
                    <span className="block text-xs font-bold text-[#092F78]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#D8EAF8] bg-[#F4FAFF]">
          <span className="text-xs font-bold text-[#0875C9] flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#FFB900]" />
            CBSE Compliant Infrastructure
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0875C9] hover:bg-[#0066B5] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
