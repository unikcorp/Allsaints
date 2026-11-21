import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courses Offered & Subject Combinations | All Saints Public School, Adoor",
  description:
    "Official CBSE courses from Kindergarten to Class XII, including Science and Commerce subject streams at All Saints Public School, Adoor.",
};

const COURSES_TABLE = [
  {
    grade: "LKG",
    subjects: "English, Hindi, Malayalam, Mathematics, General Knowledge, Rhymes and Stories, Arts & Craft, Physical Education, Computer Science",
  },
  {
    grade: "CLASS I – VIII",
    subjects: "English, Hindi, Malayalam, Mathematics, EVS / General Science, Social Science, Computer Science, Moral Science, General Knowledge, Arts & Craft, Music, Physical Education / Yoga",
  },
  {
    grade: "CLASS IX – X",
    subjects: "English, Hindi or Malayalam, Mathematics, General Science, Social Science, Computer Science, Physical Education / Yoga",
  },
  {
    grade: "CLASS XI – XII (GROUP I)",
    subjects: "English, Physics, Chemistry, Biology, Mathematics",
  },
  {
    grade: "CLASS XI – XII (GROUP II)",
    subjects: "English, Physics, Chemistry, Computer Science, Mathematics",
  },
  {
    grade: "CLASS XI – XII (GROUP III)",
    subjects: "English, Physics, Chemistry, Biology, Computer Science",
  },
  {
    grade: "CLASS XI – XII (GROUP IV)",
    subjects: "English, Business Studies, Accountancy, Economics, Mathematics",
  },
  {
    grade: "CLASS XI – XII (GROUP V)",
    subjects: "English, Business Studies, Accountancy, Economics, Computer Science",
  },
];

export default function CoursesPage() {
  return (
    <div className="section-pad container-custom font-sans">
      
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Academics</span>
        <span>&rsaquo;</span>
        <span className="text-[#092F78] font-bold">Courses</span>
      </nav>

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#0875C9]" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9]">
            Academic Streams &amp; Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#092F78] mb-3 tracking-tight">
          Academic Courses Offered
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mb-4" />
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          All Saints Public School offers CBSE curriculum courses from Kindergarten up to Senior Secondary Level (Std XII), structured to prepare students for university admissions and national competitive exams.
        </p>
      </div>

      {/* ─── Official Courses Image from Live Site ────────────────────────── */}
      <div className="mb-12 rounded-3xl overflow-hidden border-2 border-[#D8EAF8] shadow-md bg-white p-3 sm:p-5">
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-2xl overflow-hidden">
          <Image
            src="/images/school_content/1773902602-97048418469bb9b0a31631_courses.jpg"
            alt="School Courses All Saints Public School"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ─── Subject Combinations Table ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-[#D8EAF8] overflow-hidden shadow-sm mb-12">
        <div className="bg-[#EAF6FF] px-6 py-4 border-b border-[#D8EAF8] flex items-center justify-between">
          <h2 className="font-serif font-bold text-base sm:text-lg text-[#092F78]">
            Subject Distribution Across Classes
          </h2>
          <span className="text-xs font-serif font-bold text-[#0875C9] bg-white px-3 py-1 rounded-full border border-[#D8EAF8]">
            CBSE New Delhi
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans text-left">
            <thead className="bg-[#092F78] text-white font-serif uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6 w-1/4">Grade Level</th>
                <th className="py-3 px-6">Subjects Offered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COURSES_TABLE.map((row, idx) => (
                <tr key={row.grade} className={idx % 2 === 0 ? "bg-white" : "bg-[#F4FAFF]"}>
                  <td className="py-3.5 px-6 font-bold text-[#0875C9] font-serif align-top whitespace-nowrap">
                    {row.grade}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 leading-relaxed">
                    {row.subjects}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
