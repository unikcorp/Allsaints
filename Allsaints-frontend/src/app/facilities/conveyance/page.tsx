import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Conveyance | All Saints Public School, Adoor",
  description: "Official school bus conveyance details, guidelines, bus passes and service routes at All Saints Public School, Adoor."
};

const OFFICIAL_BUS_ROUTES = [
  "Adoor",
  "Pandalam",
  "Thumpamon",
  "Kaipattoor",
  "Kodumon",
  "Chandanapally",
  "Nooranad",
  "Kadambanad",
  "Enathu",
  "Elamannoor",
  "Poothamkara",
  "Theppupara"
];

export default function ConveyancePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-5 sm:py-6 lg:py-7 px-3 sm:px-5 lg:px-8 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* Top Header Banner in Primary Blue Shade */}
        <div className="bg-[#0875C9] text-white text-center py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl shadow-xs">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            CONVEYANCE
          </h1>
        </div>

        {/* Official Scraped Bus Photo */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#D8EAF8] overflow-hidden">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] rounded-xl overflow-hidden shadow-inner">
            <Image
              src="/images/school_content/1773902602-131014106869bb9b0a29dea_bus.jpg"
              alt="All Saints School Conveyance Bus Fleet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1400px"
              priority
            />
          </div>
          <p className="text-center text-xs font-serif font-bold text-[#0875C9] mt-2 sm:mt-2.5">
            Official All Saints School Bus Conveyance
          </p>
        </div>

        {/* Exact Content Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#D8EAF8] leading-relaxed text-xs sm:text-sm text-slate-700 space-y-2.5 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#092F78] border-b border-slate-100 pb-2 sm:pb-2.5 flex items-center gap-2">
            <span className="w-2 sm:w-2.5 h-5 sm:h-6 bg-[#FFB900] rounded-full" />
            School Bus Services &amp; Pass Regulations
          </h2>
          <p className="text-justify leading-relaxed">
            Sufficient number of school buses are being operated towards different parts of the school. Students can get the details from the school office. A bus pass, issued upon payment of advance bus fees, is mandatory for traveling in the school buses and must be shown daily at the time of boarding.
          </p>
          <p className="text-justify leading-relaxed">
            Students must always possess the journey card/bus pass. Only a permissible number of students are allowed to travel in the school buses, and the school follows a first-come, first-served policy for issuing the bus passes.
          </p>
        </div>

        {/* Bus Routes List */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#D8EAF8]">
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#092F78] mb-3 flex items-center gap-2">
            <span>🚌</span> BUS ROUTES:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {OFFICIAL_BUS_ROUTES.map((route, idx) => (
              <div
                key={route}
                className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-[#EAF6FF] text-[#0875C9] rounded-xl border border-[#D8EAF8] font-semibold text-xs flex items-center gap-2 hover:bg-[#D9EEFF] transition-colors"
              >
                <span className="text-xs bg-[#0875C9] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{route}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
