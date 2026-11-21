import Link from "next/link";

export default function AdmissionCTA() {
  return (
    <section className="section-pad bg-white">
      <div className="container-custom">
        <div className="bg-gradient-to-br from-[#EAF6FF] via-white to-[#F4FAFF] border-2 border-[#D8EAF8] rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md">
          <span className="inline-block px-4 py-1.5 bg-[#0875C9] text-white text-xs font-serif font-bold uppercase tracking-wider rounded-full mb-3 shadow-2xs">
            Admissions Open 2026–27
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#092F78] tracking-tight mb-2 leading-tight">
            Enroll at All Saints Public School, Adoor
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] mx-auto my-3 rounded-full" />

          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed font-sans">
            Registrations are open for Playschool, Kindergarten, Primary, and Senior Secondary classes (Science &amp; Commerce). Experience moral values, academic rigor, and creative mentorship.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            <Link
              href="/online_admission"
              className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white font-serif font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <span>🎓 Admission Enquiry</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/admissions/procedure"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EAF6FF] text-[#0875C9] border-2 border-[#0875C9] font-serif font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all"
            >
              <span>Admission Guidelines</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-serif font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all"
            >
              <span>Contact Campus Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
