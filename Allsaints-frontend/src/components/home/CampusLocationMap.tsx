import Link from "next/link";
import { SCHOOL_INFO } from "@/constants";

export default function CampusLocationMap() {
  // Direct Google Maps search / directions URL
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=All+Saints+Public+School+Pannivizha+Adoor+Kerala+691523";
  
  // Embedded Google Map iframe query URL (Universal responsive embed)
  const embedMapUrl =
    "https://maps.google.com/maps?q=All%20Saints%20Public%20School%20Pannivizha%20Adoor%20Kerala%20691523&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="section-pad bg-white border-b border-slate-100 font-sans">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0875C9]" />
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#0875C9]">
              Interactive Campus Location &amp; Directions
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#092F78] uppercase tracking-tight mb-2">
            Visit Our Peaceful Green Campus
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Located in the serene surroundings of Pannivizha, just 2.5 km from Adoor town central junction, offering an ideal learning environment.
          </p>
        </div>

        {/* Map & Direction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column (5 Cols): Address, Transport Links & Directions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Campus Address Card */}
            <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-3xl p-6 shadow-xs">
              <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#FFB900] block mb-1">
                📍 School Postal Address
              </span>
              <h3 className="font-serif font-black text-lg text-[#092F78] mb-2">
                All Saints Public School
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                Pannivizha P.O., Adoor,<br />
                Pathanamthitta District, Kerala – PIN: 691523<br />
                <span className="text-slate-500 text-xs">CBSE Affiliation No: 930501</span>
              </p>
            </div>

            {/* Proximity & Transport Landmarks */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#0875C9] block">
                🚗 Key Transport Distances
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-base">🚌</span>
                  <span className="font-serif font-bold text-sm text-[#092F78] block">2.5 km</span>
                  <span className="text-[10px] text-slate-500 block">Adoor KSRTC</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-base">🚆</span>
                  <span className="font-serif font-bold text-sm text-[#092F78] block">25 km</span>
                  <span className="text-[10px] text-slate-500 block">Chengannur Rly</span>
                </div>
               
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0875C9] hover:bg-[#0066B5] text-white py-2.5 px-4 rounded-full text-xs font-serif font-bold text-center uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🗺️ Open in Google Maps</span>
                  <span>&rarr;</span>
                </a>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-[#EAF6FF] text-[#0875C9] border border-[#0875C9] py-2.5 px-4 rounded-full text-xs font-serif font-bold text-center uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                >
                  <span>Contact Office</span>
                </Link>
              </div>
            </div>

            {/* Helpline Information */}
            <div className="bg-[#EAF6FF]/60 border border-[#D8EAF8] rounded-2xl px-5 py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Helpline / Helpdesk:</span>
                <span className="font-bold text-[#092F78] font-serif">{SCHOOL_INFO.phone[0]}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Visiting Hours:</span>
                <span className="font-semibold text-slate-700">9:00 AM – 3:30 PM</span>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Interactive Responsive Google Map Iframe */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full min-h-[380px] rounded-3xl overflow-hidden border-2 border-[#D8EAF8] shadow-md bg-slate-100">
              <iframe
                title="All Saints Public School Location Map"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-md border border-[#D8EAF8] text-[11px] font-serif font-bold text-[#092F78] flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Saints Public School · Pannivizha</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
