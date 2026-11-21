import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACILITIES } from "@/constants";
import FacilitiesInteractiveGrid from "@/components/facilities/FacilitiesInteractiveGrid";

export const metadata: Metadata = { 
  title: "Campus Infrastructure & Facilities | All Saints Public School, Adoor",
  description: "State-of-the-art infrastructural amenities, science laboratories, digital library, smart classrooms, sports ground, and 14 bus routes at All Saints Public School, Adoor."
};

export default function FacilitiesPage() {
  return (
    <div className="section-pad container-custom font-sans">
      {/* ─── Breadcrumb / Eyebrow ────────────────────────────────────────── */}
      <div className="mb-2">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#0875C9] inline-flex items-center gap-1.5 bg-[#EAF6FF] px-3.5 py-1 rounded-full border border-[#D8EAF8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
          Science Laboratories · Modern Amenities
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#092F78] mb-3 tracking-tight">
        Infrastructure &amp; Campus Facilities
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mb-8" />

      {/* ─── Overview Paragraph from Live Site ──────────────────────────── */}
      <div className="bg-gradient-to-br from-white via-[#F4FAFF] to-[#EAF6FF] border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 mb-10 text-slate-700 text-xs sm:text-sm leading-relaxed shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1.5 h-6 bg-[#FFB900] rounded-full" />
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#092F78]">
            State-of-the-Art Eco-Friendly Campus
          </h2>
        </div>
        <p className="mb-3">
          Our school has ample, unmatched, and state-of-the-art infrastructural facilities situated on an eco-friendly 10-acre campus in Pannivizha, Adoor. The campus is calm, greenish, student-friendly, and easily accessible from major junctions across Pathanamthitta and Kollam districts.
        </p>
        <p>
          Equipped with smart digital classrooms, full-fledged experimental laboratories, resourceful library, children&apos;s mini park, and extensive athletic arenas, All Saints harmonizes academic rigor with holistic well-being.
        </p>
      </div>

      {/* ─── Campus Photos Showcase ─────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <Image
            src="/images/infrastructure/infra-main.jpg"
            alt="School Main Campus Building"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-4 text-white">
            <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
              Main Academic Block
            </span>
            <p className="text-xs text-white/90">
              Spacious smart classrooms &amp; administrative wings
            </p>
          </div>
        </div>

        <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <Image
            src="/images/infrastructure/infra-campus.jpg"
            alt="Green Eco-Friendly Campus"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-4 text-white">
            <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
              Green Eco Campus
            </span>
            <p className="text-xs text-white/90">
              10 acres of lush greenery, organic farm &amp; play arenas
            </p>
          </div>
        </div>

        <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <Image
            src="/images/infrastructure/library.jpg"
            alt="School Resource Library"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-4 text-white">
            <span className="text-xs font-bold font-serif uppercase tracking-wider text-[#FFB900] block mb-0.5">
              Resourceful Digital Library
            </span>
            <p className="text-xs text-white/90">
              Thousands of reference books, periodicals &amp; research media
            </p>
          </div>
        </div>
      </div>

      {/* ─── Facilities Grid with Real Icons and View More Modal ─────────── */}
      <div className="mb-12">
        <FacilitiesInteractiveGrid
          facilities={FACILITIES}
          statusLabel="CBSE Standard Facility"
        />
      </div>

      {/* ─── Conveyance Routes & Guidance Cell ───────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Conveyance */}
        <div className="bg-white border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1.5 h-6 bg-[#FFB900] rounded-full" />
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#092F78]">
              Safe Transportation (14 Routes)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            The school operates an extensive fleet of GPS-tracked, speed-governed buses covering all key routes across Adoor and surrounding taluks:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Adoor", "Pandalam", "Thumpamon", "Kaipattoor", "Kodumon", "Chandanapally", "Nooranad", "Kadambanad", "Enathu", "Elamannoor", "Poothamkara", "Thengamam", "Parakode", "Pannivizha"].map((r) => (
              <span key={r} className="px-3 py-1 bg-[#EAF6FF] border border-[#D8EAF8] rounded-full text-[#0875C9] font-medium">
                🚌 {r}
              </span>
            ))}
          </div>
        </div>

        {/* Counselling Cell */}
        <div className="bg-white border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1.5 h-6 bg-[#FFB900] rounded-full" />
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#092F78]">
              Student Counselling &amp; Guidance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            Our qualified student counsellor provides regular individual guidance, stress management, study skills mentoring, and adolescent wellness support in complete confidentiality.
          </p>
          <div className="p-3.5 bg-[#F4FAFF] border border-[#D8EAF8] rounded-xl text-xs text-[#0875C9] font-serif font-semibold">
            🤝 Dedicated to mental health, emotional resilience &amp; career direction.
          </div>
        </div>
      </div>
    </div>
  );
}
