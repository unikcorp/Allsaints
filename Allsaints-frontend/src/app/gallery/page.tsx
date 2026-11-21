import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import GalleryClient from "@/components/gallery/GalleryClient";

export const metadata: Metadata = { 
  title: "Photo & Video Gallery | All Saints Public School, Adoor",
  description:
    "Official campus photo albums, Karate sessions, sports tournaments, nature club farm visits, and school videos at All Saints Public School, Adoor.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF5FF] via-[#F4FAFF] to-[#FFFFFF] relative overflow-hidden font-sans pb-16">
      
      {/* ─── Background Ambient Decorative Wave Swooshes (Top Left) ─────── */}
      <div className="absolute top-0 left-0 w-80 h-48 pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
          <path d="M-20 0C60 40 140 20 220 80C280 120 320 180 340 200L-20 200Z" fill="#BFE3FF" opacity="0.6" />
          <path d="M-20 0C40 60 100 50 160 110C210 160 260 180 300 190L-20 200Z" fill="#FFB900" opacity="0.4" />
        </svg>
      </div>

      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 relative z-10">
        
        {/* ─── Breadcrumb (Matching Reference Screenshot) ───────────────── */}
        <nav className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#0875C9] hover:text-[#0066B5] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
          <span className="text-slate-400 font-normal">&gt;</span>
          <span className="text-[#092F78] font-bold">Gallery</span>
        </nav>

        {/* ─── Royal Blue Gallery Title Banner (Exact Match to Screenshot) ─ */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0875C9] via-[#0066B5] to-[#0875C9] rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 mb-10 shadow-xl border border-white/20">
          
          {/* Subtle curved background lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 1000 300" fill="none" className="w-full h-full preserve-3d">
              <path d="M0 150 C 300 280, 700 20, 1000 150" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <path d="M0 220 C 400 80, 600 280, 1000 220" stroke="#FFB900" strokeWidth="2" fill="none" />
              <path d="M0 80 C 250 20, 750 260, 1000 80" stroke="#BFE3FF" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Center: Title & Subtitle Branding */}
            <div className="flex-1 text-center flex flex-col items-center w-full">
              
              {/* Circular Camera Icon Badge */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-inner mb-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3.5" strokeWidth={2} />
                </svg>
              </div>

              {/* Main Heading with Flanking Accent Lines: — GALLERY — */}
              <div className="flex items-center justify-center gap-3 sm:gap-5 w-full">
                <span className="h-[1.5px] w-10 sm:w-20 bg-white/40 hidden xs:block" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-widest text-white drop-shadow-sm">
                  GALLERY
                </h1>
                <span className="h-[1.5px] w-10 sm:w-20 bg-white/40 hidden xs:block" />
              </div>

              {/* Subtitle in Italic Serif */}
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-white/95 mt-1.5 tracking-wide text-center">
                Campus Moments, Sports Championships &amp; School Videos
              </p>
            </div>

            {/* Right: Two Tilted Polaroid Frames with Golden Sparkles */}
            <div className="relative hidden md:flex items-center justify-center gap-3 pr-2 lg:pr-6 shrink-0">
              
              {/* Decorative Golden Sparkles */}
              <div className="absolute -top-3 -left-4 text-[#FFB900] text-xl animate-pulse">✦</div>
              <div className="absolute -bottom-2 right-2 text-[#FFB900] text-sm animate-pulse">★</div>
              <div className="absolute top-1/2 -right-3 text-[#FFB900] text-base">✦</div>

              {/* Polaroid 1 (Tilted Left -6deg) */}
              <div className="relative w-36 sm:w-44 h-26 sm:h-32 bg-white p-1.5 pb-4 rounded-xl shadow-2xl -rotate-6 border border-white/70 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="relative w-full h-full rounded-md overflow-hidden bg-slate-100">
                  <Image
                    src="/images/infrastructure/infra-main.jpg"
                    alt="All Saints Academic Block"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              </div>

              {/* Polaroid 2 (Tilted Right +6deg) */}
              <div className="relative w-36 sm:w-44 h-26 sm:h-32 bg-white p-1.5 pb-4 rounded-xl shadow-2xl rotate-6 -ml-8 sm:-ml-10 border border-white/70 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="relative w-full h-full rounded-md overflow-hidden bg-slate-100">
                  <Image
                    src="/images/infrastructure/infra-campus.jpg"
                    alt="All Saints Eco Campus"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Client Gallery with Admin Controls & Interactive Cards ──────── */}
        <GalleryClient />

      </div>

      {/* ─── Bottom Decorative Flowing Wave Ribbons (Matching Screenshot) ─ */}
      <div className="w-full mt-14 pointer-events-none">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full h-12 sm:h-20" preserveAspectRatio="none">
          <path
            d="M0 40 C 360 80, 720 0, 1080 50 C 1260 75, 1380 60, 1440 50 L 1440 100 L 0 100 Z"
            fill="#FFB900"
            opacity="0.3"
          />
          <path
            d="M0 60 C 400 20, 800 90, 1200 40 C 1320 20, 1390 35, 1440 45 L 1440 100 L 0 100 Z"
            fill="#BFE3FF"
            opacity="0.5"
          />
          <path
            d="M0 80 C 320 50, 640 90, 960 60 C 1200 40, 1360 80, 1440 70 L 1440 100 L 0 100 Z"
            fill="#0875C9"
            opacity="0.8"
          />
        </svg>
      </div>

    </div>
  );
}
