"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHOOL_INFO } from "@/constants";

export default function SchoolAdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Disabled automatic popup per user request: "donot want pop up"
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Listen for manual trigger from the Floating Sidebar "ADMISSION" tab
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-admission-popup", handleOpen);
    return () => window.removeEventListener("open-admission-popup", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("asps_admission_popup_dismissed", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admissions Open 2027-2028 - All Saints Public School"
      className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      {/* ─── MEDIUM-SIZED ADMISSION POSTER / FLYER CARD ────────────────── */}
      <div className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl border-4 border-[#FFB900] overflow-visible animate-in zoom-in-95 duration-200 flex flex-col font-sans">
        
        {/* ─── Circular Orange Close Button ─── */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-30 w-10 h-10 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center text-xl font-black shadow-xl border-2 border-white transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* ─── Poster Header (Primary Blue & Deep Blue with Yellow Accents) ── */}
        <div className="bg-gradient-to-b from-[#0875C9] via-[#0066B5] to-[#092F78] text-white px-5 pt-5 pb-4 rounded-t-[22px] text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FFB900]/15 rounded-full blur-2xl pointer-events-none" />

          {/* School Crest */}
          <div className="relative w-14 h-16 mx-auto mb-2 drop-shadow-md">
            <Image
              src="/images/logo/allsaints-crest-v2.png"
              alt="All Saints School Emblem"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <div className="inline-block bg-[#FFB900] text-[#092F78] text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full mb-1 shadow-xs">
            COME JOIN · CBSE AFFIL. 930501
          </div>

          <h2 className="font-serif font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight">
            ALL SAINTS PUBLIC SCHOOL
          </h2>
          <p className="text-xs text-[#BFE3FF] font-serif font-semibold italic mt-0.5">
            &ldquo;To Create Creators&rdquo; · Adoor, Pathanamthitta
          </p>
        </div>

        {/* ─── Main Admission Highlight Banner ────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0066B5] via-[#0875C9] to-[#0066B5] text-white text-center py-2.5 px-4 shadow-inner">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[#BFE3FF]">
            Now Enrolling For New Academic Year
          </span>
          <h3 className="font-serif font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow-xs leading-tight">
            ADMISSIONS OPEN 2027–2028
          </h3>
          <span className="block text-[11px] font-medium text-[#BFE3FF]">
            Strong Academics &amp; 360° Holistic Development
          </span>
        </div>

        {/* ─── Medium Concise Offerings (Crisp, Non-Bulky Badges) ─────────── */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#EAF6FF]/60 to-white space-y-2.5">
          
          <div className="grid grid-cols-1 gap-2 text-xs sm:text-[13px] text-slate-800 font-medium">
            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#D8EAF8] shadow-2xs">
              <span className="w-7 h-7 rounded-lg bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-sm flex-shrink-0">
                👶
              </span>
              <span><strong>Playschool &amp; Kindergarten:</strong> LKG &amp; UKG</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#D8EAF8] shadow-2xs">
              <span className="w-7 h-7 rounded-lg bg-[#FFF9E6] text-[#FFB900] flex items-center justify-center font-bold text-sm flex-shrink-0">
                📚
              </span>
              <span><strong>Primary &amp; High School:</strong> Classes 1 to 10 (CBSE)</span>
            </div>

            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#D8EAF8] shadow-2xs">
              <span className="w-7 h-7 rounded-lg bg-[#EAF6FF] text-[#0875C9] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                🎓
              </span>
              <div>
                <strong>Senior Secondary (Classes 11 &amp; 12):</strong>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  Science (PCMB / PCMC) &amp; Commerce
                </span>
              </div>
            </div>
          </div>

          {/* Quick Highlight Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] font-semibold text-slate-700">
            <span className="bg-[#FFF9E6] text-[#996F00] px-2.5 py-1 rounded-full border border-[#FFB900]/40">
              🏆 100% CBSE Pass Record
            </span>
            <span className="bg-[#EAF6FF] text-[#0875C9] px-2.5 py-1 rounded-full border border-[#BFE3FF]">
              🌳 Science Laboratories
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              🥋 Karate &amp; Sports
            </span>
          </div>

        </div>

        {/* ─── Bottom Actions & Contact Helpline Bar ─────────────────────── */}
        <div className="p-4 bg-[#F4FAFF] border-t border-[#D8EAF8] rounded-b-[22px] space-y-3">
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/admissions/apply"
              onClick={handleClose}
              className="flex-1 bg-[#0875C9] hover:bg-[#0066B5] text-white py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-serif font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Apply Online &rarr;
            </Link>
            <Link
              href="/admissions/enquiry"
              onClick={handleClose}
              className="bg-white hover:bg-[#EAF6FF] text-[#0875C9] border-2 border-[#0875C9] py-2.5 px-3.5 rounded-xl text-center text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Enquiry
            </Link>
          </div>

          {/* Helpline Phone Direct Tap */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 px-1">
            <span>📞 Helplines:</span>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <a href={`tel:${SCHOOL_INFO.phone[0]}`} className="hover:text-[#0875C9]">
                {SCHOOL_INFO.phone[0]}
              </a>
              <span>·</span>
              <a href={`tel:${SCHOOL_INFO.phone[1]}`} className="hover:text-[#0875C9]">
                {SCHOOL_INFO.phone[1]}
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
