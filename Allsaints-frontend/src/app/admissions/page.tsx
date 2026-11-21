import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { 
  title: "Admissions & General Policies 2026–27 | All Saints Public School, Adoor",
  description: "Official admission procedures, policies, age criteria, and document requirements for All Saints Public School, Adoor."
};

export default function AdmissionsPage() {
  return (
    <div className="section-pad container-custom font-sans">
      {/* ─── Breadcrumb / Eyebrow ────────────────────────────────────────── */}
      <div className="mb-2">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#7A0C2E] inline-flex items-center gap-1.5 bg-[#FFF5F7] px-3.5 py-1 rounded-full border border-[#F3C4D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          Admissions Open 2026–2027 · Play Class to Class XII
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#5C0620] mb-3 tracking-tight">
        Admissions &amp; General Regulations
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-[#7A0C2E] to-[#D97706] rounded-full mb-8" />

      {/* ─── Hero CTA Box ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#FFFDFD] via-white to-[#FFF5F7] border-2 border-[#F3C4D0] rounded-3xl p-6 sm:p-8 mb-10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#7A0C2E] block mb-1">
            Online Registration &amp; Counseling
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C0620] mb-1">
            Apply Online via Admission Desk
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-sans max-w-xl">
            Submit your application inquiry, connect with academic counselors, and schedule campus interaction for new session enrollment.
          </p>
        </div>
        <Link
          href="/admissions/enquiry"
          className="bg-[#7A0C2E] hover:bg-[#5C0620] text-white px-7 py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <span>Admission Enquiry &rarr;</span>
        </Link>
      </div>

      {/* ─── Official Guidelines from Live Website (Full Texts) ────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm font-sans leading-relaxed shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <span className="w-1.5 h-6 bg-[#D97706] rounded-full" />
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5C0620]">
            Official Admission Guidelines &amp; Code of Regulations
          </h3>
        </div>

        <div className="space-y-4">
          <p>
            • <strong>Application Submission:</strong> Duly filled in and photo affixed application forms shall be submitted online or offline directly to the school office during the allotted period. The form and prospectus are available from the school office on payment.
          </p>
          <p>
            • <strong>Granting of Admission:</strong> Admission will be granted after completing all verification procedures and is subject to the vacancies available in each class. Normally fresh admissions to Class IX, X, and XII are strictly subject to CBSE transfer guidelines. Closure of admissions will be notified on the school notice board and official website. The Principal reserves all rights to accept or decline any application.
          </p>
          <p>
            • <strong>Age Norms &amp; Undertaking:</strong> National and state rules regarding minimum age for admission to Kindergarten and Class 1 will strictly apply. Parents/guardians must agree to uphold the school&apos;s code of discipline, uniform protocol, and fee schedules.
          </p>
          <p>
            • <strong>Entrance Evaluation:</strong> Applicants to Middle and Senior Secondary batches will undergo an academic aptitude evaluation to assist in appropriate stream allocation (Science / Commerce).
          </p>
          
          <div className="pt-2">
            <h4 className="font-serif font-bold text-sm text-[#5C0620] mb-2">
              Mandatory Documents Required at Admission:
            </h4>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Duly completed and signed admission application form with recent passport-size photographs</li>
              <li>Original Birth Certificate issued by Municipal Corporation / Panchayat authority</li>
              <li>Original Transfer Certificate (TC) from the previous recognized educational institution</li>
              <li>Progress report card / Mark list of the last qualifying examination</li>
              <li>Copy of student Aadhaar card and community / vaccination records if applicable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
