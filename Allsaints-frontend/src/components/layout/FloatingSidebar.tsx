"use client";

import Link from "next/link";
import { SCHOOL_INFO } from "@/constants";

export default function FloatingSidebar() {
  return (
    <aside
      aria-label="Quick Connect Sidebar"
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-end shadow-2xl select-none"
    >
      <div className="flex flex-col rounded-l-2xl shadow-2xl border-l border-t border-b border-white/20">
        
        {/* 1. Phone Button */}
        <a
          href={`tel:${SCHOOL_INFO.phone[0]}`}
          className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-[#0875C9] hover:bg-[#0066B5] text-white flex items-center justify-center transition-all cursor-pointer rounded-tl-2xl"
          aria-label="Call School Helpline"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>

          {/* Slide-out Label Tab */}
          <div className="pointer-events-none group-hover:pointer-events-auto absolute right-full top-0 h-full flex items-center bg-[#0875C9] group-hover:bg-[#0066B5] text-white text-xs sm:text-sm font-sans font-semibold px-4 rounded-l-xl shadow-xl whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out border-t border-b border-l border-white/20 z-50">
            <span>Call: {SCHOOL_INFO.phone[0]}</span>
          </div>
        </a>

        {/* 2. WhatsApp Button (Success Green #22B573) */}
        <a
          href={`https://wa.me/${SCHOOL_INFO.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-[#22B573] hover:bg-[#1fa066] text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>

          {/* Slide-out Label Tab */}
          <div className="pointer-events-none group-hover:pointer-events-auto absolute right-full top-0 h-full flex items-center bg-[#22B573] group-hover:bg-[#1fa066] text-white text-xs sm:text-sm font-sans font-semibold px-4 rounded-l-xl shadow-xl whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out border-t border-b border-l border-white/20 z-50">
            <span>Chat on WhatsApp</span>
          </div>
        </a>

        {/* 3. Email Button (Secondary Blue #0066B5) */}
        <a
          href={`mailto:${SCHOOL_INFO.email}`}
          className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-[#0066B5] hover:bg-[#0875C9] text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Send an Email"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>

          {/* Slide-out Label Tab */}
          <div className="pointer-events-none group-hover:pointer-events-auto absolute right-full top-0 h-full flex items-center bg-[#0066B5] group-hover:bg-[#0875C9] text-white text-xs sm:text-sm font-sans font-semibold px-4 rounded-l-xl shadow-xl whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out border-t border-b border-l border-white/20 z-50">
            <span>{SCHOOL_INFO.email}</span>
          </div>
        </a>

        {/* 4. Location Button (Primary Blue #0875C9) */}
        <a
          href="https://www.google.com/maps?cid=14582232119634452676&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-[#0875C9] hover:bg-[#0066B5] text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Campus Location"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          {/* Slide-out Label Tab */}
          <div className="pointer-events-none group-hover:pointer-events-auto absolute right-full top-0 h-full flex items-center bg-[#0875C9] group-hover:bg-[#0066B5] text-white text-xs sm:text-sm font-sans font-semibold px-4 rounded-l-xl shadow-xl whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out border-t border-b border-l border-white/20 z-50">
            <span>Campus Location · Adoor</span>
          </div>
        </a>

        {/* 5. ADMISSION Tab (Deep Blue #092F78) */}
        <Link
          href="/admissions/apply"
          className="group relative w-11 sm:w-12 py-5 sm:py-6 bg-[#092F78] hover:bg-[#0875C9] text-white flex items-center justify-center transition-all cursor-pointer select-none rounded-bl-2xl"
          aria-label="Go to Admission Portal"
          title="Click to go to Admission Page"
        >
          <span className="[writing-mode:vertical-rl] tracking-widest font-serif font-black text-xs sm:text-sm uppercase select-none transition-transform group-hover:tracking-[0.25em]">
            ADMISSION
          </span>

          {/* Slide-out Label Tab */}
          <div className="pointer-events-none group-hover:pointer-events-auto absolute right-full top-0 h-full flex items-center bg-[#092F78] group-hover:bg-[#0875C9] text-white text-xs sm:text-sm font-sans font-bold px-4 rounded-l-xl shadow-xl whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out border-t border-b border-l border-white/20 z-50">
            <span>Apply for Admission 2026-27 &rarr;</span>
          </div>
        </Link>

      </div>
    </aside>
  );
}
