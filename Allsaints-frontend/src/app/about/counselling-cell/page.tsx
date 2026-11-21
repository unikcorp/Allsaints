import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Counselling Cell | All Saints Public School, Adoor",
  description:
    "Official Counselling Cell, Medical Assistance, and Grievance Redressal Cell of All Saints Public School, Adoor.",
};

export default function CounsellingPage() {
  return (
    <div className="py-6 sm:py-8 lg:py-10 container-custom font-sans">
      
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">About ASPS</span>
        <span>&rsaquo;</span>
        <span className="text-[#092F78] font-bold">Counselling Cell</span>
      </nav>

      {/* Top Header Banner in Primary Blue */}
      <div className="bg-[#0875C9] text-white text-center py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl mb-5 sm:mb-6 shadow-xs">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          COUNSELLING CELL
        </h1>
      </div>

      <div className="w-full space-y-4 sm:space-y-5">
        
        {/* ─── 1. COUNSELING CELL BANNER & TITLE ─────────────────────────── */}
        <div className="bg-[#EAF6FF]/80 border-2 border-[#D8EAF8] rounded-3xl p-5 sm:p-7 text-center shadow-xs">
          <div className="relative w-full max-w-2xl mx-auto h-[240px] sm:h-[340px] md:h-[400px] mb-4 sm:mb-5 rounded-2xl overflow-hidden shadow-sm bg-white border border-[#D8EAF8]">
            <Image
              src="/images/school_content/1773902602-108975316169bb9b0a32df8_councelling_20cell.png"
              alt="Counseling Cell Image"
              fill
              className="object-contain p-2"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78] tracking-tight uppercase">
            COUNSELING CELL
          </h2>
        </div>

        {/* ─── 2. COUNSELLING & MEDICAL ASSISTANCE DETAILS ────────────────── */}
        <div className="bg-white border border-[#D8EAF8] rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs space-y-6 sm:space-y-7">
          
          {/* Sub-section: COUNSELLING */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#0875C9]" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#092F78] tracking-tight uppercase">
                COUNSELLING
              </h3>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans pl-4 border-l-2 border-[#0875C9]/40">
              Our school cares for the mental, emotional, and physical wellbeing of all its stakeholders. Hence, a Counselling cell is functioning in our school under the guidance of the experts. The cell will deal with normal developmental issues such as stress management, emotion management, character formation, as well as mentoring under their guidance.
            </p>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub-section: MEDICAL ASSISTANCE */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFB900]" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#092F78] tracking-tight uppercase">
                MEDICAL ASSISTANCE
              </h3>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans pl-4 border-l-2 border-[#FFB900]/60">
              Any student vulnerable to physical illness within the campus will be given first aid medication in the medical room. The case will immediately be informed to the parents/guardians. In serious cases, the students will be taken to nearby hospitals and will be taken care of until the arrival of the parents/guardians. Expenses of the hospital shall be met by the parents/guardians.
            </p>
          </div>

        </div>

        {/* ─── 3. GRIEVANCE REDRESSAL CELL SECTION ──────────────────────── */}
        <div className="bg-[#EAF6FF]/80 border-2 border-[#D8EAF8] rounded-3xl p-4 sm:p-6 text-center shadow-xs">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78] tracking-tight uppercase">
            GRIEVANCE REDRESSAL CELL
          </h2>
        </div>

        <div className="bg-white border border-[#D8EAF8] rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-sans mb-5 sm:mb-6">
            General or individual grievances of the stakeholders of the school, especially of the students, girls, and women, will be genuinely and seriously addressed by a team of teachers presided over by the Principal. The team will take all necessary and immediate steps for its redressal. Any kind of child abuse or its attempt, sexual or other harassment or its attempt, etc., shall be reported or complained to this forum.
          </p>

          <div className="bg-[#EAF6FF] border border-[#D8EAF8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 sm:mt-6">
            <div className="text-center sm:text-left">
              <h4 className="font-serif font-bold text-sm text-[#092F78] mb-1">
                Have a grievance or confidential concern?
              </h4>
              <p className="text-xs text-slate-600 font-sans">
                Submit directly to the Principal and Grievance Committee for immediate intervention.
              </p>
            </div>
            <Link
              href="/contact/complain"
              className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-xs flex-shrink-0"
            >
              Submit Grievance
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
