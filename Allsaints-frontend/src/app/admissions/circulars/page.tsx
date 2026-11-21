import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Circulars | All Saints Public School",
  description: "Official administrative circulars, academic notices, and CBSE notifications for All Saints Public School, Adoor."
};

const CIRCULAR_DOCS = [
  {
    id: 1,
    title: "Official School Circular - Part 1",
    file: "/documents/circular-1.pdf",
    desc: "Administrative directive regarding academic guidelines, schedules, and student regulations."
  },
  {
    id: 2,
    title: "Official School Circular - Part 2",
    file: "/documents/circular-2.pdf",
    desc: "Parent and institutional notification regarding term dates, code of conduct, and procedures."
  }
];

export default function CircularsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Banner in Primary Blue Shade */}
        <div className="bg-[#0875C9] text-white text-center py-4 px-6 rounded-2xl mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black uppercase tracking-wider text-white">
            SCHOOL CIRCULARS
          </h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Official circulars and notifications issued by the Principal and the School Management Committee.
          </p>
        </div>

        {/* Circulars List & Viewers */}
        <div className="space-y-10">
          {CIRCULAR_DOCS.map((circ) => (
            <div
              key={circ.id}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8EAF8]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-[#EAF6FF] text-[#0875C9] text-xs font-bold rounded-full border border-[#D8EAF8]">
                      Official Gazette
                    </span>
                    <span className="text-xs text-slate-400 font-medium">All Saints Public School</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#092F78]">
                    {circ.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {circ.desc}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={circ.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Embedded PDF Viewer */}
              <div className="w-full h-[600px] sm:h-[800px] rounded-xl overflow-hidden border border-[#D8EAF8] bg-slate-100">
                <iframe referrerPolicy="strict-origin-when-cross-origin"
                  src={`${circ.file}#toolbar=1`}
                  title={circ.title}
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
