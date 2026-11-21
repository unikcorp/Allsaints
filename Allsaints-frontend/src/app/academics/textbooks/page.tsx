import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, Eye, FileText, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Textbooks Declaration & List | All Saints Public School, Adoor",
  description:
    "Official CBSE declaration of textbooks by Manager and Principal, and prescribed textbook list for All Saints Public School, Adoor.",
};

// ─── 2026–2027 Official Textbook Sheets ─────────────────────────────────────
const TEXTBOOK_DETAILS_2026_27 = [
  {
    page: 1,
    title: "Official Prescribed Textbooks (Sheet 1)",
    classes: "KG, STD-I, STD-II, STD-III",
    src: "/images/textbooks/textbooks-2026-27-page-1.png",
    description: "Prescribed books and workbooks for Kindergarten and Classes I, II, and III.",
  },
  {
    page: 2,
    title: "Official Prescribed Textbooks (Sheet 2)",
    classes: "STD-IV",
    src: "/images/textbooks/textbooks-2026-27-page-2.png",
    description: "Prescribed textbooks, language workbooks, and value education for Class IV.",
  },
  {
    page: 3,
    title: "Official Prescribed Textbooks (Sheet 3)",
    classes: "STD-V, STD-VI, STD-VII",
    src: "/images/textbooks/textbooks-2026-27-page-3.png",
    description: "Prescribed NCERT and supplementary textbooks for Classes V, VI, and VII.",
  },
  {
    page: 4,
    title: "Official Prescribed Textbooks (Sheet 4)",
    classes: "STD-VIII, STD-IX, STD-X",
    src: "/images/textbooks/textbooks-2026-27-page-4.png",
    description: "Prescribed NCERT textbooks, languages, and AI curriculum for Classes VIII, IX, and X.",
  },
  {
    page: 5,
    title: "Official Prescribed Textbooks (Sheet 5)",
    classes: "STD-XI (Science & Commerce)",
    src: "/images/textbooks/textbooks-2026-27-page-5.png",
    description: "Prescribed NCERT curriculum for Senior Secondary Class XI Science and Commerce streams.",
  },
  {
    page: 6,
    title: "Official Prescribed Textbooks (Sheet 6)",
    classes: "STD-XII (Science & Commerce)",
    src: "/images/textbooks/textbooks-2026-27-page-6.png",
    description: "Prescribed NCERT and CBSE publications for Senior Secondary Class XII Science and Commerce streams.",
  },
];

// ─── 2024–2025 Textbook Scans ────────────────────────────────────────────────
const TEXTBOOK_SCANS_2024_25 = [
  {
    src: "/images/school_content/1773902398-208050332469bb9a3e66d0a_textbook.jpg",
    title: "Official Prescribed Textbooks Declaration – Part 1",
  },
  {
    src: "/images/school_content/1773902398-112296775169bb9a3e65f6c_textbok.jpg",
    title: "Official Prescribed Textbooks Declaration – Part 2",
  },
  {
    src: "/images/school_content/1773902398-85429481369bb9a3e64c21_text.jpg",
    title: "Official Prescribed Textbooks Declaration – Part 3",
  },
];

export default function TextbooksPage() {
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
        <span className="text-[#0875C9] font-bold">Textbooks</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue Shade ───────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-5 px-6 rounded-2xl mb-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
          TEXTBOOKS
        </h1>
        <p className="text-sm sm:text-base font-serif font-bold text-[#FFB900] mt-1 uppercase tracking-wider">
          CBSE BYE-LAWS COMPLIANCE &amp; DECLARATION
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* ─── Academic Years Selector / Distinction Bar ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Academic Year 2026–2027 – View Textbook Details */}
          <div className="bg-gradient-to-br from-white to-[#F0F8FF] rounded-2xl p-6 border-2 border-[#0875C9] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#0875C9] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Latest Session
            </div>
            <div className="space-y-2 mb-6 pr-14">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0875C9]">
                <BookOpen className="w-4 h-4" />
                <span>Academic Year 2026–2027</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
                View Textbook Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Comprehensive prescribed textbooks list for the <strong>2026–2027</strong> academic year covering Kindergarten through Class XII (Science &amp; Commerce).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#textbooks-2026-27"
                className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Textbook Details</span>
              </a>
              <a
                href="/documents/textbooks-details-2026-27.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="All-Saints-Textbook-Details-2026-27.pdf"
                className="inline-flex items-center justify-center gap-1.5 border border-[#0875C9] text-[#0875C9] hover:bg-[#EAF6FF] px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Academic Year 2024–2025 – Download PDF */}
          <div className="bg-white rounded-2xl p-6 border border-[#D8EAF8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <FileText className="w-4 h-4 text-[#0875C9]" />
                <span>Academic Year 2024–2025</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
                Download PDF
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Official prescribed textbook declaration and list for the previous <strong>2024–2025</strong> academic session as filed under CBSE bye-laws.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/documents/textbooks-declaration.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="List-of-Textbooks-2024-25.pdf"
                className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
              <a
                href="#textbooks-2024-25"
                className="inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Archive</span>
              </a>
            </div>
          </div>

        </div>

        {/* ─── Statutory Declarations Section ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Declaration of Textbook by Manager */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-3 py-1 rounded-full text-xs font-bold text-[#0875C9]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Compliance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
                Declaration of Textbook by Manager
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Official statutory declaration executed by the School Manager certifying scrutiny and compliance with <strong>Rule 2.4.7 (b) of the CBSE Affiliation Bye-Laws</strong>.
              </p>
            </div>
            <div>
              <a
                href="/documents/declaration-of-textbook-manager.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Declaration-of-Textbook-Manager.pdf"
                className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Declaration of Textbook by Principal */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#EAF6FF] border border-[#D8EAF8] px-3 py-1 rounded-full text-xs font-bold text-[#0875C9]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Compliance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
                Declaration of Textbook by Principal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Official statutory declaration executed by the Principal certifying scrutiny and compliance with <strong>Rule 2.4.7 (b) of the CBSE Affiliation Bye-Laws</strong>.
              </p>
            </div>
            <div>
              <a
                href="/documents/declaration-of-textbook-principal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Declaration-of-Textbook-Principal.pdf"
                className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

        </div>

        {/* ─── Joint Declaration Context ─────────────────────────────────── */}
        <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg sm:text-xl font-serif font-black text-[#092F78] mb-3">
            Joint Declaration by Manager &amp; Principal
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <p>
              In strict compliance with <strong>Rule 2.4.7 (b) of the CBSE Affiliation Bye-Laws</strong>, we hereby declare and certify that we have thoroughly scrutinized the contents of all textbooks prescribed by the school for all classes from Kindergarten up to Class XII.
            </p>
            <p>
              The school primarily prescribes <strong>NCERT publications</strong> for all secondary and senior secondary classes. The supplementary textbooks and early foundational readers from private publishers have been carefully vetted and do not contain any objectionable, communal, derogatory, or anti-constitutional material that hurts the feelings of any class, community, gender, or religious group in society.
            </p>
            <p>
              The management and the school administration assume complete statutory responsibility for the books prescribed.
            </p>
          </div>
        </div>

        {/* ─── SECTION 1: 2026–2027 – View Textbook Details ─────────────── */}
        <section id="textbooks-2026-27" className="scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] px-3 py-1 rounded-full text-xs font-bold mb-2">
                Academic Year 2026–2027
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
                View Textbook Details (2026–2027)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Official prescribed textbook lists and publishers across all classes from Kindergarten through Class XII.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="/documents/textbooks-details-2026-27.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="All-Saints-Textbook-Details-2026-27.pdf"
                className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* 6 Official Textbook Detail Images */}
          <div className="space-y-10">
            {TEXTBOOK_DETAILS_2026_27.map((item) => (
              <div
                key={item.page}
                className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#092F78] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center text-xs font-black">
                        {item.page}
                      </span>
                      <span>{item.title}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-[#0875C9] bg-[#EAF6FF] px-2.5 py-0.5 rounded-md">
                        Classes: {item.classes}
                      </span>
                      <span className="text-slate-500">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#0875C9] font-bold hover:underline self-start sm:self-auto"
                  >
                    <span>View Full Size</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Display Official Scanned / Detail Image */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image
                    src={item.src}
                    alt={`${item.title} - ${item.classes}`}
                    width={1240}
                    height={1754}
                    className="w-full h-auto object-contain mx-auto"
                    priority={item.page === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 2: 2024–2025 – Download PDF ──────────────────────── */}
        <section id="textbooks-2024-25" className="scroll-mt-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                Academic Year 2024–2025
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
                2024–2025 – Download PDF
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Official prescribed textbook lists and statutory declaration for the 2024–&apos;25 academic year.
              </p>
            </div>
            
            {/* Clearly Visible Download PDF Button for 2024–2025 */}
            <a
              href="/documents/textbooks-declaration.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="List-of-Textbooks-2024-25.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF (2024–2025)</span>
            </a>
          </div>

          {/* Archived 2024–2025 Scanned Official Textbook Lists */}
          <div className="space-y-8">
            <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-2xl p-4 sm:p-6 mb-6">
              <p className="text-xs sm:text-sm text-slate-700">
                Below are the archived scanned declaration sheets for the <strong>2024–2025</strong> academic year. Click the <strong>Download PDF</strong> button above to download the official PDF declaration document.
              </p>
            </div>

            {TEXTBOOK_SCANS_2024_25.map((item, idx) => (
              <div
                key={item.src}
                className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-[#092F78] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <span>{item.title}</span>
                  </h3>
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#0875C9] font-bold hover:underline"
                  >
                    <span>View Full Size</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative w-full h-[650px] sm:h-[850px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
