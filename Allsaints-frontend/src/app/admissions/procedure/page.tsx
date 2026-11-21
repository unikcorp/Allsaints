import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admissions & General Policies | All Saints Public School",
  description: "Official admission guidelines, age rules, document requirements, and general admission policies for All Saints Public School, Adoor."
};

const POLICIES = [
  {
    title: "Application Submission",
    text: "Duly filled in and photo affixed application form shall be submitted online / offline to the school during the allotted period. The form and prospectus will be issued from the school office on payment."
  },
  {
    title: "Admission Criteria & Vacancies",
    text: "Admission will be granted after completing all procedures and subject to the vacancies available in each class. Normally new admissions to class IX, X and XII will not be entertained. Closure of admissions will be notified in the school notice board and website. The Principal reserves all the rights to accept/reject any application without assigning any reason."
  },
  {
    title: "Age Rules & Parent Undertaking",
    text: "The rules and regulations on minimum age for admission to various classes will be applicable in our school also. Parents/ Guardians / students who are willing to fully cooperate with the school management and all other stakeholders and comply with regard to the discipline, code of conduct, rules and regulations, fee structure, timely payment of fees etc. of the school only need to apply and admissions will be granted only on an explicit undertaking in this regard by the parent/guardian and the candidates."
  },
  {
    title: "Entrance Evaluation",
    text: "Applicants to senior classes must undergo entrance written/oral tests and admission will be granted based on its merit."
  },
  {
    title: "Mandatory Documents Required",
    text: "Following documents should essentially be attached with the application for admission: The duly filled in and photo affixed application form, official birth certificate to prove minimum age, original Transfer Certificate (TC) as the case requires, copy of Aadhar card etc."
  },
  {
    title: "Senior Secondary Admission Eligibility",
    text: "Candidates for the Senior Secondary courses must have passed the AISSE / ICSE / SSLC / other equivalent courses and they should produce eligibility certificate, migration certificate etc. from the competent authorities."
  },
  {
    title: "Candidates from Abroad / NRI Students",
    text: "Candidate from abroad shall, in addition to the above, produce all necessary documents prescribed by the Governments / CBSE such as Migration Certificate, Original Transcript Certificate, latest marklist etc."
  }
];

export default function AdmissionProcedurePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Image
              src="/images/school_content/1773902602-125377422769bb9b0a32697_admissions.jfif"
              alt="Admissions"
              width={300}
              height={55}
              className="h-14 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#092F78] mb-3">
            ADMISSIONS &amp; GENERAL POLICIES
          </h1>
          <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Essential procedures, eligibility criteria, and administrative guidelines for admission to All Saints Public School.
          </p>
        </div>

        {/* Policy Items */}
        <div className="space-y-4 mb-10">
          {POLICIES.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-[#D8EAF8] transition-all hover:shadow-md border-l-4 border-l-[#0875C9]"
            >
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#092F78] mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF6FF] text-[#0875C9] text-xs font-bold inline-flex items-center justify-center border border-[#D8EAF8]">
                  {idx + 1}
                </span>
                {p.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                {p.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#0875C9] to-[#0066B5] rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg">
          <h2 className="text-xl sm:text-2xl font-serif font-bold mb-2">
            Begin Your Academic Journey at All Saints
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto mb-6 leading-relaxed">
            Submit your admission registration online or visit our school admissions counter during working hours (9:00 AM – 4:00 PM).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admissions/apply"
              className="bg-[#FFB900] hover:bg-[#E0A300] text-[#092F78] px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Online Admission Form &rarr;
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            >
              Contact Admissions Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
