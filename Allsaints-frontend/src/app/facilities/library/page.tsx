import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "School Library | All Saints Public School, Adoor",
  description: "Official rules, borrowing regulations, and facilities of the School Library at All Saints Public School, Adoor."
};

const LIBRARY_RULES = [
  "All the staff and students are directed to avail themselves of the library facilities in the school.",
  "Students may borrow only one book at a time and return it after a week and it can be renewed for one more week. The librarian may call for a book at any time from a borrower.",
  "Books will be issued to students during the library periods mentioned in the time table and also before and after school hours. No book will be issued or received back during the teaching hours.",
  "Examine the books while borrowing and report to the librarian in case of any damage, missing pages etc. before leaving the library.",
  "All library books and cards must be returned before the end of February every year. Clearance from the library is required before applying for Transfer Certificate.",
  "Strict Discipline and silence should be maintained in the library.",
  "Books borrowed from the library should be kept neat. No marking, underlining or scribbling of any kind in the library book is allowed.",
  "Each Student should read and write summary of minimum 5 books in an academic year.",
  "A fine of Rs. 1 per day will be charged for late returning of book and the fact will be noted in the defaulters column of Library Card.",
  "If books are lost, damaged or defaced, a fine up to double the cost of the book will be charged. In case of any dispute the Principal’s decision shall be final and binding.",
  "Reference books shall not be taken out of the library. No other books are allowed in the reference section.",
  "Handle the books carefully."
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Top Header Banner in Primary Blue Shade */}
        <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            SCHOOL LIBRARY
          </h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            All the staff and students are directed to avail themselves of the library facilities in the school.
          </p>
        </div>

        {/* Official Library Scraped Photo */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8EAF8] mb-8 overflow-hidden">
          <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-inner">
            <Image
              src="/images/school_content/1773902398-97681020769bb9a3e580eb_library.jpg"
              alt="All Saints School Library"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
          <p className="text-center text-xs font-serif font-bold text-[#0875C9] mt-3">
            School Library &amp; Reading Room
          </p>
        </div>

        {/* Rules Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] mb-8">
          <h2 className="text-lg font-serif font-bold text-[#092F78] mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#FFB900] rounded-full" />
            Library Rules &amp; Regulations
          </h2>
          <div className="space-y-3.5">
            {LIBRARY_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#0875C9]/30 transition-all text-xs sm:text-sm text-slate-700"
              >
                <span className="w-6 h-6 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
