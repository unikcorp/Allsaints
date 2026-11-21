import { notFound } from "next/navigation";
import Link from "next/link";
import { STATUTORY_DOCUMENTS } from "@/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const base = STATUTORY_DOCUMENTS.map((doc) => ({
    slug: doc.slug,
  }));
  return [...base, { slug: "school-management-certificate" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = STATUTORY_DOCUMENTS.find(
    (d) => d.slug === slug || (slug === "building-fitness-certificate" && d.slug.includes("fitness")) || (slug === "possession-certificate" && d.slug.includes("possssion")) || (slug === "school-management-certificate" && d.slug === "school-management-committee")
  );

  if (!doc) {
    return { title: "Document Not Found | All Saints Public School" };
  }

  return {
    title: `${doc.label} | Statutory Compliance | All Saints Public School, Adoor`,
    description: doc.desc,
  };
}

export default async function DocumentViewerPage({ params }: Props) {
  const { slug } = await params;
  
  // Find doc by slug with alias tolerance (possession vs possssion, building-fitness)
  const doc = STATUTORY_DOCUMENTS.find(
    (d) =>
      d.slug === slug ||
      (slug === "building-fitness-certificate" && d.slug === "building-fitness-certificate") ||
      (slug === "possession-certificate" && d.slug === "possssion-certificate") ||
      (slug === "possssion-certificate" && d.slug === "possssion-certificate") ||
      (slug === "school-management-certificate" && d.slug === "school-management-committee")
  );

  if (!doc) {
    notFound();
  }

  return (
    <div className="section-pad container-custom font-sans">
      
      {/* ─── Breadcrumb Navigation ────────────────────────────────────────── */}
      <nav className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#0875C9] transition-colors">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href="/documents" className="hover:text-[#0875C9] transition-colors">
          Documents
        </Link>
        <span>&rsaquo;</span>
        <span className="text-[#0875C9] font-bold">{doc.label}</span>
      </nav>

      {/* ─── Document Header Card ─────────────────────────────────────────── */}
      <div className="bg-[#F4FAFF] border-2 border-[#D8EAF8] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0875C9] text-white text-[11px] font-serif font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-2xs">
              <span>📜 Document #{doc.order} of 11</span>
              <span>·</span>
              <span>{doc.status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#092F78] tracking-tight">
              {doc.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed font-sans">
              {doc.desc}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>🏛️ Issuing Authority:</span>
              <strong className="text-slate-800 font-serif">{doc.authority}</strong>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 flex-shrink-0">
            {doc.pdfUrls.map((url, idx) => (
              <a
                key={url}
                href={url}
                download
                className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center whitespace-nowrap"
              >
                <span>Download PDF {doc.pdfUrls.length > 1 ? `(Part ${idx + 1})` : ""}</span>
              </a>
            ))}
            <a
              href={doc.pdfUrls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-[#EAF6FF] text-[#0875C9] border border-[#0875C9] px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide transition-all flex items-center justify-center whitespace-nowrap"
            >
              <span>Open Full PDF in New Tab &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── School Management Committee (SMC) Directory (For SMC Page) ──── */}
      {doc.slug === "school-management-committee" && (
        <div className="bg-white rounded-3xl border-2 border-[#D8EAF8] p-6 sm:p-7 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div>
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#FFB900] block mb-1">
                Governing Body
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#092F78]">
                School Management Committee (SMC)
              </h2>
            </div>
            <Link
              href="/about/pta-and-smc"
              className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#0875C9] hover:underline"
            >
              <span>View Full Committee Directory &rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F4FAFF] border border-[#D8EAF8]">
              <span className="text-[11px] font-bold text-[#0875C9] uppercase block mb-1">Member Secretary / Principal</span>
              <h3 className="font-serif font-bold text-sm text-[#092F78]">Rev. Dr. James Stephen Olikal</h3>
              <p className="text-xs text-slate-500 mt-1">Principal, All Saints Public School</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4FAFF] border border-[#D8EAF8]">
              <span className="text-[11px] font-bold text-[#0875C9] uppercase block mb-1">Manager Nominee</span>
              <h3 className="font-serif font-bold text-sm text-[#092F78]">Fr. Philipose Charivupurayidathil</h3>
              <p className="text-xs text-slate-500 mt-1">Director, ASPS</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4FAFF] border border-[#D8EAF8]">
              <span className="text-[11px] font-bold text-[#0875C9] uppercase block mb-1">Parent Representative</span>
              <h3 className="font-serif font-bold text-sm text-[#092F78]">Adv. Mathew K. Thomas</h3>
              <p className="text-xs text-slate-500 mt-1">Advocate, District Court</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4FAFF] border border-[#D8EAF8]">
              <span className="text-[11px] font-bold text-[#0875C9] uppercase block mb-1">Educationist Nominee</span>
              <h3 className="font-serif font-bold text-sm text-[#092F78]">Mrs. Priya S. Nair</h3>
              <p className="text-xs text-slate-500 mt-1">Higher Secondary Teacher</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Embedded PDF Viewers ─────────────────────────────────────────── */}
      <div className="space-y-8 mb-12">
        {doc.pdfUrls.map((pdfUrl, idx) => (
          <div
            key={pdfUrl}
            className="bg-white rounded-3xl border border-[#D8EAF8] overflow-hidden shadow-md"
          >
            <div className="bg-[#F4FAFF] px-6 py-3 border-b border-[#D8EAF8] flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#092F78] uppercase tracking-wider flex items-center gap-2">
                <span>📄</span>
                <span>
                  Official Document Viewer {doc.pdfUrls.length > 1 ? `- Part ${idx + 1} of ${doc.pdfUrls.length}` : ""}
                </span>
              </span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0875C9] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open in fullscreen</span>
                <span>&rarr;</span>
              </a>
            </div>

            {/* Embedded Native PDF Viewer */}
            <div className="relative w-full h-[650px] sm:h-[800px] bg-slate-50">
              <iframe referrerPolicy="strict-origin-when-cross-origin"
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                title={`${doc.title} - Viewer ${idx + 1}`}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
              />
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-[#D8EAF8] text-center text-xs text-slate-500">
              <span>If the document does not display in your browser, </span>
              <a href={pdfUrl} download className="text-[#0875C9] font-bold underline">
                click here to download the PDF directly.
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Navigation Grid: All 11 Documents in Order ────────────────────── */}
      <div className="border-t border-[#D8EAF8] pt-10">
        <div className="text-center mb-6">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#FFB900] block mb-1">
            Official Regulatory Registry
          </span>
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[#092F78]">
            All Statutory CBSE Documents &amp; Certificates
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATUTORY_DOCUMENTS.map((item) => {
            const isCurrent = item.slug === doc.slug;
            return (
              <Link
                key={item.slug}
                href={`/documents/${item.slug}`}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? "bg-[#0875C9] text-white border-[#0875C9] shadow-sm font-bold"
                    : "bg-white hover:bg-[#EAF6FF] border-[#D8EAF8] text-slate-700 hover:border-[#BFE3FF]"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    isCurrent ? "bg-[#FFB900] text-[#092F78]" : "bg-[#EAF6FF] text-[#0875C9]"
                  }`}
                >
                  {item.order}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-serif truncate leading-tight">
                    {item.label}
                  </span>
                  <span
                    className={`block text-[10px] mt-0.5 truncate ${
                      isCurrent ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    {item.authority}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
