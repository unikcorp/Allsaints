import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { YoutubeIcon } from "@/components/common/SocialIcons";

export const metadata: Metadata = {
  title: "Infrastructure | All Saints Public School, Adoor",
  description:
    "Official campus infrastructure, laboratories, smart classrooms, sports amenities, and student facilities at All Saints Public School, Adoor.",
};

const INFRA_FACILITIES = [
  "Smart classrooms with comfortable seating arrangements",
  "Neat and tidy washrooms with adequate availability of pure drinking water",
  "Well-equipped Physics, Chemistry, and Biology laboratories",
  "Advanced computer lab and language lab with interactive panel and audio system",
  "Full-fledged and spacious library",
  "Big auditorium and spacious staff rooms",
  "Effective communication system and modernized administrative offices",
  "Vast playgrounds and coaching for various sports, games, yoga, and karate practices",
  "Powerful and wide-ranged Wi-Fi connection and solar energy conservation",
  "Systematic waste management and perfect safety and security provisions including CCTV surveillance and fire safety measures",
];

const COUNSELLING_ACTIVITIES = [
  "Helping students identify their areas of interest and aptitude",
  "Guiding students about application processes in India and abroad",
  "Providing updated information about various institutions, courses, and careers",
  "Offering sustained support in the admission process, including collating and dispatching transcripts, writing recommendation letters, and helping with Personal Statements",
];

export default function InfrastructurePage() {
  return (
    <div className="section-pad container-custom font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-6 text-sm font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Facilities</span>
        <span>&rsaquo;</span>
        <span className="text-[#0875C9] font-bold">Infrastructure</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue Shade ───────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-6 px-6 sm:px-10 rounded-3xl mb-12 shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-wider text-white">
          INFRASTRUCTURE
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#FFB900] mt-2 uppercase tracking-wider">
          CAMPUS FACILITIES &amp; LEARNING AMENITIES
        </p>
      </div>

      {/* ─── EXACT SECTION 1: Visit Our School & Video ─────────────────── */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border-2 border-[#D8EAF8] mb-14 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78] uppercase tracking-wider mb-4">
          Visit Our School
        </h2>
        <div className="w-20 h-1 bg-[#0875C9] rounded-full mx-auto mb-6" />
        
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 font-sans">
          Take a virtual walkthrough of our lush green campus, modern academic blocks, and state-of-the-art facilities in Adoor.
        </p>

        {/* Embedded Video Player */}
        <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg border border-[#D8EAF8] aspect-video bg-black">
          <iframe referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/pRwRAYmVIQ4?rel=0"
            title="All Saints Public School Campus Video"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* YouTube Watch Button */}
        <div>
          <a
            href="https://youtu.be/pRwRAYmVIQ4?si=yM73NRap5tOaAFuF"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF0000] to-[#CC0000] hover:from-[#E60000] hover:to-[#B30000] text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <YoutubeIcon className="w-6 h-6" />
            <span>Watch Our School Video</span>
          </a>
        </div>
      </div>

      {/* ─── EXACT SECTION 2: INFRASTRUCTURE Card ─────────────────────── */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-[#D8EAF8] overflow-hidden mb-14">
        {/* Large Infrastructure Image */}
        <div className="relative w-full h-[400px] sm:h-[550px] md:h-[650px] bg-slate-100">
          <Image
            src="/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg"
            alt="Infrastructure of All Saints Public School"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#092F78] uppercase text-center mb-6 tracking-wide">
            INFRASTRUCTURE
          </h2>

          <p className="text-base sm:text-lg text-slate-700 text-center max-w-4xl mx-auto leading-relaxed mb-8 font-sans">
            Our school has ample, unmatched, and state-of-the-art infrastructural facilities. The campus is calm, greenish, student-friendly, eco-friendly, and easily accessible. We have a child-friendly Play School, Kinder Garten, mini park, and many more attractions.
          </p>

          <p className="text-center font-bold text-[#092F78] text-xl sm:text-2xl mb-8">
            Our facilities include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {INFRA_FACILITIES.map((facility, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#F4FAFF] border border-[#D8EAF8] hover:border-[#0875C9]/40 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#0875C9] text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-base text-slate-800 leading-relaxed font-sans font-medium">
                  {facility}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── EXACT SECTION 3: Two Column (Lab Facility & Counselling Services) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        
        {/* Lab Facility Card */}
        <div className="bg-white rounded-3xl shadow-md border-2 border-[#D8EAF8] overflow-hidden flex flex-col">
          <div className="relative w-full h-[320px] sm:h-[400px] bg-slate-100">
            <Image
              src="/images/school_content/1773902398-212600336869bb9a3e5ae72_infra1.jpg"
              alt="Lab Facility at All Saints Public School"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="p-8 sm:p-10 flex-1 flex flex-col justify-center text-center">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] mb-4">
              Lab Facility
            </h3>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans m-0">
              The school is managed by dedicated faculty who are committed to providing quality education. We have state-of-the-art laboratories equipped with modern amenities to facilitate effective learning.
            </p>
          </div>
        </div>

        {/* Counselling Services Card */}
        <div className="bg-white rounded-3xl shadow-md border-2 border-[#D8EAF8] p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78] text-center mb-4">
              Counselling Services
            </h3>
            <p className="text-base sm:text-lg font-bold text-slate-800 text-center mb-6">
              Counselling activities encompass the following:
            </p>

            <ul className="space-y-4">
              {COUNSELLING_ACTIVITIES.map((activity, index) => (
                <li key={index} className="flex items-start gap-3 text-base text-slate-700">
                  <span className="text-[#FFB900] font-bold text-xl leading-none mt-0.5">&bull;</span>
                  <span className="leading-relaxed font-sans">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
