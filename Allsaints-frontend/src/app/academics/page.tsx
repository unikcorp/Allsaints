import type { Metadata } from "next";
import Link from "next/link";
import { ACADEMIC_PROGRAMS } from "@/constants";

export const metadata: Metadata = { 
  title: "Academics & CBSE Curriculum | All Saints Public School, Adoor",
  description: "Complete CBSE academic curriculum, streams, courses, and flagship non-scholastic programs from Kindergarten to Class XII at All Saints Public School, Adoor."
};

export default function AcademicsPage() {
  return (
    <div className="section-pad container-custom font-sans">
      {/* ─── Breadcrumb / Eyebrow ────────────────────────────────────────── */}
      <div className="mb-2">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#0875C9] inline-flex items-center gap-1.5 bg-[#EAF6FF] px-3.5 py-1 rounded-full border border-[#D8EAF8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
          Affiliated to CBSE New Delhi · Affiliation No: 930773
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#092F78] mb-3 tracking-tight">
        Academic Programs &amp; CBSE Curriculum
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mb-8" />

      {/* ─── Intro Card ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-white via-[#F4FAFF] to-[#EAF6FF] border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 mb-10 text-slate-700 text-xs sm:text-sm leading-relaxed shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1.5 h-6 bg-[#FFB900] rounded-full" />
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#092F78]">
            CBSE Academic Framework · From Foundation to Excellence
          </h2>
        </div>
        <p className="mb-3">
          All Saints Public School offers continuous educational pathways from Pre-Primary through Senior Secondary. Governed by the national curriculum guidelines of the <strong>Central Board of Secondary Education [CBSE], New Delhi</strong>, our pedagogy fosters analytical competence, scientific inquiry, multi-lingual fluency (English, Malayalam, Hindi), and rigorous preparation for competitive examinations (NEET, JEE, KEAM, CUET).
        </p>
        <p>
          With a consistent record of <strong>100% CBSE board examination success</strong>, our educators mentor each student towards academic mastery and ethical integrity.
        </p>
      </div>

      {/* ─── Program Divisions ───────────────────────────────────────────── */}
      <div className="space-y-8 mb-12">
        {ACADEMIC_PROGRAMS.map((prog) => (
          <div
            key={prog.id}
            className="bg-white border-2 border-[#D8EAF8] hover:border-[#0875C9]/40 transition-all rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#092F78]">
                  {prog.label}
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFB900]">
                  {prog.grades}
                </span>
              </div>
              <span className="text-xs font-serif font-bold px-3.5 py-1.5 bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] rounded-full self-start sm:self-auto shadow-2xs">
                CBSE Standard Curriculum
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              {prog.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#092F78] mb-3">
                Key Subjects &amp; Core Disciplines:
              </h4>
              <div className="flex flex-wrap gap-2">
                {prog.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-3.5 py-1.5 bg-[#EAF6FF] text-[#0875C9] text-xs font-semibold rounded-lg border border-[#D8EAF8]"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Flagship Non-Scholastic Initiatives (Full Live Content) ─────── */}
      <div className="bg-white border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1.5 h-6 bg-[#FFB900] rounded-full" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#092F78]">
            Flagship Co-Curricular &amp; Holistic Programs
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Complementing classroom pedagogy, All Saints conducts hallmark student-development programs designed to build confidence, communicative fluency, and democratic leadership:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 bg-white border border-[#D8EAF8] rounded-xl hover:shadow-xs transition-shadow">
            <span className="inline-block bg-[#0875C9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
              LUSE
            </span>
            <strong className="text-[#092F78] block font-serif text-sm mb-1">
              Let Us Speak English
            </strong>
            <p className="text-slate-600 leading-relaxed font-sans">
              Daily classroom spoken English drills monitored by teacher mentors and student captains to cultivate spontaneous, flawless fluency.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D8EAF8] rounded-xl hover:shadow-xs transition-shadow">
            <span className="inline-block bg-[#FFB900] text-[#092F78] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
              MMC
            </span>
            <strong className="text-[#092F78] block font-serif text-sm mb-1">
              Mega Music Carnival
            </strong>
            <p className="text-slate-600 leading-relaxed font-sans">
              Grand open-stage music celebration featuring solo performances, instrumental ensembles, and mass choirs to banish stage fright.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D8EAF8] rounded-xl hover:shadow-xs transition-shadow">
            <span className="inline-block bg-[#0875C9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
              CuC
            </span>
            <strong className="text-[#092F78] block font-serif text-sm mb-1">
              Can You Challenge
            </strong>
            <p className="text-slate-600 leading-relaxed font-sans">
              One-minute uninterrupted extempore speech challenge testing quick analytical cognition, vocabulary, and articulation across languages.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D8EAF8] rounded-xl hover:shadow-xs transition-shadow">
            <span className="inline-block bg-[#FFB900] text-[#092F78] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
              PARL
            </span>
            <strong className="text-[#092F78] block font-serif text-sm mb-1">
              Saintsians Parliament
            </strong>
            <p className="text-slate-600 leading-relaxed font-sans">
              Democratic student elections selecting Prime Minister and Ministers for Education, Sports, Culture, and Discipline.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Bottom CTA Bar ─────────────────────────────────────────────── */}
      <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#092F78]">
            Admissions Open for Academic Year 2026–27
          </h3>
          <p className="text-xs text-slate-600 font-sans">
            Secure enrollment from Play Class to Class XII. View fee breakdown or apply online.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admissions/fees"
            className="bg-white hover:bg-[#EAF6FF] text-[#0875C9] border border-[#0875C9] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Fee Structure
          </Link>
          <Link
            href="/admissions/apply"
            className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Apply for Admission &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
