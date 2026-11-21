import Link from "next/link";
import Image from "next/image";
import { SCHOOL_INFO, NAV_ITEMS } from "@/constants";
import SocialLinks from "@/components/common/SocialIcons";

const ACADEMIC_LINKS = [
  { label: "Play School & Kindergarten (LKG & UKG)", href: "/academics/courses" },
  { label: "Primary Wing (Grades 1–5)", href: "/academics/courses" },
  { label: "Middle School (Grades 6–8)", href: "/academics/courses" },
  { label: "Secondary School (Grades 9–10)", href: "/academics/courses" },
  { label: "Senior Secondary: Science (Bio-Maths / PCMB)", href: "/academics/courses" },
  { label: "Senior Secondary: Science (Maths-Computer / PCMC)", href: "/academics/courses" },
  { label: "Senior Secondary: Commerce (Accountancy, Business, Economics)", href: "/academics/courses" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#FFFFFF] via-[#F4FAFF] to-[#EAF6FF] border-t border-[#D8EAF8] text-slate-700 font-sans text-[15.5px]">
      {/* Main Footer Container */}
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* School Overview */}
        <div>
          <Link href="/" className="flex items-center gap-3.5 mb-4 group cursor-pointer">
            <div className="relative w-14 h-16 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo/allsaints-clean-crest.png"
                alt="All Saints Logo"
                fill
                className="object-contain"
                sizes="56px"
                unoptimized
              />
            </div>
            <div>
              <span className="font-serif font-black text-lg text-[#092F78] group-hover:text-[#0875C9] uppercase tracking-tight block leading-tight transition-colors">
                All Saints Public School
              </span>
              <span className="text-[13px] font-sans text-slate-500 font-semibold group-hover:text-slate-700 transition-colors">
                Adoor · CBSE Affiliation: 930501
              </span>
            </div>
          </Link>

          <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
            A premier CBSE-affiliated Senior Secondary institution in Adoor, dedicated to fashioning visionaries, moral leaders, and creators of the future. Managed by The Malankara Catholic Educational Society of Diocese of Pathanamthitta.
          </p>

          <Link
            href="/about/mission-and-vision"
            className="text-[14.5px] font-semibold text-[#0875C9] hover:text-[#092F78] flex items-center gap-2 bg-[#EAF6FF] hover:bg-[#D9EEFF] px-3.5 py-2 rounded-xl border border-[#D8EAF8] mb-5 transition-colors cursor-pointer group"
          >
            <span className="text-[#FFB900] font-serif font-bold">Motto:</span>
            <span className="group-hover:underline">&ldquo;{SCHOOL_INFO.motto}&rdquo;</span>
          </Link>

          {/* Follow Us Section with Authentic Brand Icons */}
          <div>
            <div className="font-serif font-bold text-[#092F78] text-[15px] uppercase tracking-wider mb-2.5">
              Follow Us
            </div>
            <SocialLinks variant="footer" />
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <div className="font-serif font-bold text-[#092F78] text-base uppercase tracking-wider mb-4 pb-2 border-b border-[#D8EAF8]">
            Quick Links
          </div>
          <ul className="space-y-2.5 text-[15px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[#0875C9] hover:underline transition-colors text-slate-600 font-medium flex items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[#FFB900] text-xs transition-transform group-hover:translate-x-0.5">▸</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Academic Offerings (Now Fully Clickable) */}
        <div>
          <div className="font-serif font-bold text-[#092F78] text-base uppercase tracking-wider mb-4 pb-2 border-b border-[#D8EAF8]">
            Academics
          </div>
          <ul className="space-y-2.5 text-[15px]">
            {ACADEMIC_LINKS.map((academic, i) => (
              <li key={i}>
                <Link
                  href={academic.href}
                  className="hover:text-[#0875C9] hover:underline transition-colors text-slate-600 font-medium flex items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[#FFB900] text-xs transition-transform group-hover:translate-x-0.5">▸</span>
                  <span>{academic.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info (All Clickable Links) */}
        <div>
          <div className="font-serif font-bold text-[#092F78] text-base uppercase tracking-wider mb-4 pb-2 border-b border-[#D8EAF8]">
            Contact School
          </div>
          <div className="space-y-3.5 text-[15px] text-slate-600">
            <a
              href="https://maps.google.com/?q=All+Saints+Public+School+Adoor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 hover:text-[#0875C9] hover:underline transition-colors leading-relaxed group cursor-pointer"
              title="Open Campus on Google Maps"
            >
              <span className="text-base flex-shrink-0">📍</span>
              <span className="group-hover:text-[#0875C9]">{SCHOOL_INFO.address}</span>
            </a>

            <div className="flex items-center gap-2.5">
              <span className="text-base flex-shrink-0">📞</span>
              <div className="flex flex-wrap items-center gap-1.5 font-semibold">
                <a
                  href={`tel:${SCHOOL_INFO.phone[0]}`}
                  className="hover:text-[#0875C9] hover:underline transition-colors cursor-pointer"
                >
                  {SCHOOL_INFO.phone[0]}
                </a>
                <span>,</span>
                <a
                  href={`tel:${SCHOOL_INFO.phone[1]}`}
                  className="hover:text-[#0875C9] hover:underline transition-colors cursor-pointer"
                >
                  {SCHOOL_INFO.phone[1]}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-base flex-shrink-0">✉️</span>
              <a
                href={`mailto:${SCHOOL_INFO.email}`}
                className="hover:text-[#0875C9] hover:underline transition-colors break-all font-semibold cursor-pointer"
              >
                {SCHOOL_INFO.email}
              </a>
            </div>

            <div className="pt-3">
              <Link
                href="/admissions/apply"
                className="inline-block bg-[#0875C9] text-white hover:bg-[#0066B5] px-6 py-3 rounded-full text-sm font-serif font-bold tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                🎓 Admission Enquiry
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar (All Clickable Links) */}
      <div className="border-t border-[#D8EAF8] bg-white py-5 text-[14.5px] text-slate-500">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="m-0">
            &copy; {year} <Link href="/" className="hover:text-[#0875C9] hover:underline font-semibold">All Saints Public School</Link>. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
            <Link href="/documents" className="hover:text-[#0875C9] hover:underline">
              CBSE Affiliated (930501)
            </Link>
            <span>·</span>
            <Link href="/documents/affiliation-certificate" className="hover:text-[#0875C9] hover:underline">
              Affiliation Certificate
            </Link>
            <span>·</span>
            <Link href="/documents" className="hover:text-[#0875C9] hover:underline">
              Mandatory Disclosures
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#0875C9] hover:underline">
              Contact Us
            </Link>
            <span>·</span>
            <a
              href="https://unikcorp.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium group"
            >
              <span>Made by</span>
              <span className="font-bold text-[#0875C9] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full border border-[#D8EAF8] group-hover:bg-[#0875C9] group-hover:text-white transition-all shadow-xs">
                Unikcorp
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
