import { SCHOOL_INFO } from "@/constants";
import Image from "next/image";

export default function MottoSection() {
  return (
    <section className="section-pad bg-white border-b border-slate-100">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#6B0B2E] block mb-2">
            Guiding Philosophy &amp; Celestial Vocation
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#4A051E] uppercase tracking-tight mb-2">
            Our Motto: &ldquo;{SCHOOL_INFO.mottoEnglish}&rdquo;
          </h2>

          <div className="text-base sm:text-lg font-serif font-semibold text-[#D97706] mb-3">
            {SCHOOL_INFO.mottoSanskrit} · &ldquo;{SCHOOL_INFO.mottoTransliteration}&rdquo;
          </div>

          <div className="w-20 h-1 bg-gradient-to-r from-[#6B0B2E] to-[#D97706] mx-auto mb-8 rounded-full" />

          {/* Philosophy Card with Clear Transparent Crest */}
          <div className="bg-[#FAF2F5]/70 border border-[#EED3DC] rounded-3xl p-6 sm:p-10 text-left shadow-xs flex flex-col md:flex-row items-center gap-8">
            {/* Clear Crest Emblem (No Square Background, Fully Transparent) */}
            <div className="relative w-28 h-32 sm:w-36 sm:h-40 flex-shrink-0 transition-transform hover:scale-105">
              <Image
                src="/images/logo/allsaints-clean-crest.png"
                alt="All Saints Public School Crest"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Explanation Quote */}
            <div className="flex-1">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#6B0B2E] block mb-2">
                The Foundation of Our Vocation
              </span>
              <blockquote className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans italic border-l-3 border-[#D97706] pl-4">
                &ldquo;{SCHOOL_INFO.mottoExplanation}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
