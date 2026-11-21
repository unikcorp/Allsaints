import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School Uniform | All Saints Public School, Adoor",
  description:
    "Official prescribed school uniform guidelines for boys and girls from LKG to Class XII at All Saints Public School, Adoor.",
};

interface UniformCategoryDetail {
  category: string;
  points: string[];
}

interface UniformSection {
  grade: string;
  boys: {
    summary?: string;
    details?: UniformCategoryDetail[];
  };
  girls: {
    summary?: string;
    details?: UniformCategoryDetail[];
  };
}

const UNIFORM_SECTIONS: UniformSection[] = [
  {
    grade: "LKG, UKG",
    boys: {
      summary:
        "Navy-blue shorts with maroon check half sleeve shirts, black shoes with grayish blue socks and belt with school emblem.",
    },
    girls: {
      summary:
        "Navy-blue pinafore (non-detachable) with maroon check shirts, black shoes with greyish blue socks and belt with school emblem.",
    },
  },
  {
    grade: "STD I - III",
    boys: {
      summary:
        "Navy-blue shorts with violet half sleeve shirts, black shoes with navy blue socks and belt with school emblem.",
    },
    girls: {
      summary:
        "Violet stripped pinafore (non-detachable), black shoes with blue socks with white stripes and belt with school emblem.",
    },
  },
  {
    grade: "CLASSES IV – V",
    boys: {
      details: [
        {
          category: "Shirt",
          points: [
            "Light blue shirting fabric with a fine white dot pattern.",
            "Carbon blue collar.",
            "Carbon blue sleeve piping placed 1 inch above the sleeve end.",
            "Front placket in carbon blue with ankle-cut finish, ending exactly at the bottom of the pocket.",
            "One chest pocket on the left side with the school badge, with carbon blue piping positioned 1 inch below the top of the pocket.",
          ],
        },
        {
          category: "Half Pants",
          points: ["Carbon blue pinstripe fabric half pants with back elastic."],
        },
        {
          category: "Accessories",
          points: [
            "Black belt with steel buckle and the School emblem engraved on the buckle.",
            "Carbon blue socks with two white stripes at the top.",
            "Black shoes.",
          ],
        },
      ],
    },
    girls: {
      details: [
        {
          category: "Shirt",
          points: [
            "Light blue shirting fabric with a fine white dot pattern.",
            "Carbon blue collar.",
            "Carbon blue sleeve piping placed 1 inch above the sleeve end.",
            "Front placket in carbon blue with ankle-cut finish, ending exactly at the bottom of the pocket.",
            "One chest pocket on the left side with the school badge, with carbon blue piping positioned 1 inch below the top of the pocket.",
          ],
        },
        {
          category: "Skirt",
          points: [
            "Carbon blue pinstripe fabric pleated skirt with back elastic.",
            "Two light blue stripes (½ inch width each) placed 2 inches above the hemline.",
          ],
        },
        {
          category: "Accessories",
          points: [
            "Black belt with steel buckle and the School emblem engraved on the buckle.",
            "Carbon blue socks with two white stripes at the top.",
            "Black shoes.",
          ],
        },
      ],
    },
  },
  {
    grade: "CLASSES VI – XII",
    boys: {
      details: [
        {
          category: "Shirt",
          points: [
            "Light blue shirting fabric with a fine white dot pattern.",
            "Carbon blue collar.",
            "Carbon blue sleeve piping placed 1 inch above the sleeve end.",
            "Front placket in carbon blue with ankle-cut finish, ending exactly at the bottom of the pocket.",
            "One chest pocket on the left side with the school badge, with carbon blue piping positioned 1 inch below the top of the pocket.",
          ],
        },
        {
          category: "Pants",
          points: [
            "Carbon blue pinstripe fabric full-length pant with back pocket.",
            "Clean straight fit.",
          ],
        },
        {
          category: "Accessories",
          points: [
            "Black belt with steel buckle and School emblem engraved on the buckle.",
            "Carbon blue socks with two white stripes at the top.",
            "Black shoes.",
          ],
        },
      ],
    },
    girls: {
      details: [
        {
          category: "Shirt",
          points: [
            "Light blue shirt made of fine white dot pattern fabric.",
            "Three-quarter sleeve (below elbow length).",
            "Carbon blue sleeve piping placed 2 inches above the sleeve end.",
            "Sleeve with side slit of 1.5 inches depth.",
          ],
        },
        {
          category: "Overcoat",
          points: [
            "Sleeveless coat made of carbon blue pinstripe fabric, with length extending below the hip.",
            "Chinese neck-style collar at the top.",
            "School logo on the left chest of the coat.",
            "Two cut pockets on the lower sides of the coat.",
          ],
        },
        {
          category: "Pants",
          points: [
            "Carbon blue pinstripe fabric full-length pants with back elastic.",
            "Clean straight fit.",
          ],
        },
        {
          category: "Accessories",
          points: [
            "Black belt with steel buckle and the School emblem engraved on the buckle.",
            "Carbon blue socks with two white stripes at the top.",
            "Black shoes.",
          ],
        },
      ],
    },
  },
];

export default function UniformsPage() {
  return (
    <div className="section-pad container-custom font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav className="mb-6 text-sm font-medium text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-slate-400">Academics</span>
        <span>&rsaquo;</span>
        <span className="text-[#0875C9] font-bold">School Uniform</span>
      </nav>

      {/* ─── Top Header Banner in Primary Blue Shade ───────────────── */}
      <div className="bg-[#0875C9] text-white text-center py-6 px-6 sm:px-10 rounded-3xl mb-10 shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-wider text-white">
          SCHOOL UNIFORM
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#FFB900] mt-2 uppercase tracking-wider">
          PRESCRIBED DRESS CODE &amp; ATTIRE REGULATIONS
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-10 text-center">
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
          The school requires all students to be neatly dressed in the prescribed uniform at all times. The dress code is strictly enforced, and any violation may lead to disciplinary action.
        </p>
      </div>

      {/* ─── LARGE OFFICIAL UNIFORM PATTERN IMAGE ───────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-[#D8EAF8] mb-14 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
          <div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#092F78]">
              Official Uniform Pattern Chart
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Prescribed fabric patterns, colors, and styling guidelines across all academic wings.
            </p>
          </div>
          <a
            href="/images/school_content/1773902398-50417472569bb9a3e62ccd_uniform.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span>View Full Size &rarr;</span>
          </a>
        </div>

        {/* Extra Large Image Container */}
        <div className="relative w-full h-[600px] sm:h-[850px] md:h-[1100px] lg:h-[1250px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
          <Image
            src="/images/school_content/1773902398-50417472569bb9a3e62ccd_uniform.jpg"
            alt="Official Prescribed School Uniform Pattern of All Saints Public School"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </div>

      {/* ─── Uniform Specifications Grid (Large Font) ────────────────────── */}
      <div className="space-y-8 max-w-6xl mx-auto mb-14">
        {UNIFORM_SECTIONS.map((sec) => (
          <div
            key={sec.grade}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#D8EAF8] transition-all hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2">
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#092F78]">
                {sec.grade}
              </h3>
              <span className="text-xs sm:text-sm font-bold px-4 py-1.5 bg-[#EAF6FF] text-[#0875C9] rounded-full border border-[#D8EAF8] uppercase tracking-wider self-start sm:self-auto">
                Official Dress Code
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Boys Uniform */}
              <div className="bg-[#F4FAFF] p-6 rounded-2xl border-l-4 border-[#0875C9] shadow-2xs">
                <span className="font-bold text-[#0875C9] block mb-3 flex items-center gap-2 text-lg">
                  <span>👦</span> Boys Uniform:
                </span>
                
                {sec.boys.summary && (
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
                    {sec.boys.summary}
                  </p>
                )}

                {sec.boys.details && (
                  <div className="space-y-4">
                    {sec.boys.details.map((detail) => (
                      <div key={detail.category} className="space-y-1.5">
                        <h4 className="font-bold text-sm sm:text-base text-[#092F78] uppercase tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0875C9]" />
                          {detail.category}
                        </h4>
                        <ul className="space-y-1 text-sm sm:text-base text-slate-700 pl-3">
                          {detail.points.map((pt, pIdx) => (
                            <li key={pIdx} className="leading-relaxed flex items-start gap-2">
                              <span className="font-semibold text-slate-400 text-xs mt-0.5 select-none">
                                {pIdx + 1}.
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Girls Uniform */}
              <div className="bg-[#FFFDF5] p-6 rounded-2xl border-l-4 border-[#FFB900] shadow-2xs">
                <span className="font-bold text-[#FFB900] block mb-3 flex items-center gap-2 text-lg">
                  <span>👧</span> Girls Uniform:
                </span>

                {sec.girls.summary && (
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
                    {sec.girls.summary}
                  </p>
                )}

                {sec.girls.details && (
                  <div className="space-y-4">
                    {sec.girls.details.map((detail) => (
                      <div key={detail.category} className="space-y-1.5">
                        <h4 className="font-bold text-sm sm:text-base text-[#092F78] uppercase tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
                          {detail.category}
                        </h4>
                        <ul className="space-y-1 text-sm sm:text-base text-slate-700 pl-3">
                          {detail.points.map((pt, pIdx) => (
                            <li key={pIdx} className="leading-relaxed flex items-start gap-2">
                              <span className="font-semibold text-slate-400 text-xs mt-0.5 select-none">
                                {pIdx + 1}.
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        {/* Statutory Note Card (Large) */}
        <div className="bg-[#FFF4CC]/60 rounded-3xl p-8 border-l-6 border-[#FFB900] shadow-sm">
          <h4 className="text-xl sm:text-2xl font-serif font-black text-[#092F78] mb-3 flex items-center gap-2.5">
            <span className="text-[#FFB900]">📌</span> IMPORTANT NOTE
          </h4>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-sans m-0">
            School emblem must be stitched at the specified place on the uniform. White uniform and school name labelled colour T-shirts shall be worn on special occasions which will be intimated occasionally.
          </p>
        </div>
      </div>

    </div>
  );
}
