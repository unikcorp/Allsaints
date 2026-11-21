"use client";

import { useState } from "react";
import { ACADEMIC_PROGRAMS } from "@/constants";
import { cn } from "@/lib/utils";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import type { AcademicLevel } from "@/types";

export default function AcademicsSection() {
  const [active, setActive] = useState<AcademicLevel>("primary");
  const program = ACADEMIC_PROGRAMS.find((p) => p.id === active)!;

  return (
    <section className="section-pad bg-[#f8fafc] border-b border-slate-200">
      <div className="container-custom">
        <SectionTitle
          tag="Academic Structure"
          title="Curriculum &amp; Educational Divisions"
          subtitle="Comprehensive CBSE framework designed for continuous cognitive development across every grade level."
        />

        {/* Tab selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {ACADEMIC_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              onClick={() => setActive(prog.id)}
              className={cn(
                "px-5 py-2.5 rounded-lg font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase",
                active === prog.id
                  ? "bg-[#0284C7] text-white shadow-md border-b-2 border-[#16A34A]"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7]"
              )}
            >
              {prog.label} ({prog.grades})
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#BAE6FD] rounded-xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F2744] uppercase tracking-tight">
                {program.label} Education
              </h3>
              <span className="text-xs font-sans font-bold text-[#0284C7] uppercase tracking-wider">
                {program.grades} · CBSE Framework
              </span>
            </div>
            <Button href="/academics/courses" variant="outline" size="sm">
              Division Syllabus &rarr;
            </Button>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
            {program.description}
          </p>

          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#002855] mb-3">
              Included Curriculum Areas:
            </h4>
            <div className="flex flex-wrap gap-2">
              {program.subjects.map((sub) => (
                <span
                  key={sub}
                  className="px-3 py-1.5 bg-[#f0f5fc] text-[#002855] text-xs font-semibold rounded border border-blue-100 hover:border-[#E89D26] transition-colors"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
