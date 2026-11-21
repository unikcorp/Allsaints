import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SCHOOL_INFO, MANAGEMENT_TEAM } from "@/constants";

export const metadata: Metadata = { 
  title: "About ASPS | History, Mission, Vision & Governance",
  description: "Official history, Mission, Vision, Motto, and Management of All Saints Public School, Adoor. Affiliated to CBSE New Delhi (Affiliation No: 930773)."
};

export default function AboutPage() {
  return (
    <div className="section-pad container-custom">
      {/* ─── Breadcrumb / Eyebrow ────────────────────────────────────────── */}
      <div className="mb-2">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#0875C9] inline-flex items-center gap-1.5 bg-[#EAF6FF] px-3.5 py-1 rounded-full border border-[#D8EAF8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900]" />
          About All Saints Public School
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#092F78] mb-3 tracking-tight">
        History, Mission &amp; Governance
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full mb-8" />

      {/* ─── 1. History & Foundation ─── */}
      <section className="bg-gradient-to-br from-[#FFFFFF] via-[#F4FAFF] to-[#EAF6FF] border border-[#D8EAF8] rounded-2xl p-6 sm:p-10 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-7 bg-[#FFB900] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#092F78]">
            School Foundation &amp; Heritage
          </h2>
        </div>
        <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-sans">
          <p>
            <strong>All Saints Public School, Adoor</strong> was established in <strong>June 2002</strong> by <strong>Rev. Fr. Thomas Kumbakattil</strong>, under the apostolic blessings of <strong>His Beatitude Moran Mor Cyril Baselios Catholicose</strong>, the late Archbishop of Trivandrum. The school was founded with the resolute ideal of imparting value-based quality education to children irrespective of caste, creed, or economic background.
          </p>
          <p>
            At present, the institution is governed under the prestigious aegis of <strong>The Malankara Catholic Educational Society of the Diocese of Pathanamthitta</strong>, presided over by <strong>His Excellency Most Rev. Dr. Samuel Mar Irenios</strong>, Bishop of the Diocese of Pathanamthitta as its Patron and President.
          </p>
          <p>
            The school is affiliated to the <strong>Central Board of Secondary Education [CBSE], New Delhi (Affiliation No: 930773, School Code: 75786)</strong>. Guided by an ISO-compliant educational ethos, the institution offers co-educational schooling from <strong>Play Class, LKG, and UKG through Class XII</strong> with specialized streams in Science (Bio-Maths, Computer Science) and Commerce.
          </p>
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#D8EAF8]">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="block text-xl font-serif font-bold text-[#0875C9]">2002</span>
            <span className="text-[11px] text-slate-500 font-sans">Year Established</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="block text-xl font-serif font-bold text-[#0875C9]">930773</span>
            <span className="text-[11px] text-slate-500 font-sans">CBSE Affiliation No</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="block text-xl font-serif font-bold text-[#0875C9]">10 Acres</span>
            <span className="text-[11px] text-slate-500 font-sans">Serene Eco Campus</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="block text-xl font-serif font-bold text-[#0875C9]">100%</span>
            <span className="text-[11px] text-slate-500 font-sans">CBSE Board Success</span>
          </div>
        </div>
      </section>

      {/* ─── 2. School Motto & Meaning ─────────────────────────────────── */}
      <section className="bg-white border-2 border-[#D8EAF8] rounded-2xl p-6 sm:p-10 mb-12 shadow-sm">
        <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#0875C9] block mb-1">
          Our Guiding Philosophy
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#092F78] mb-2">
          &ldquo;{SCHOOL_INFO.mottoEnglish}&rdquo;
        </h2>
        <div className="text-sm sm:text-base font-serif font-bold text-[#FFB900] mb-4">
          {SCHOOL_INFO.mottoSanskrit} (Sanskrit) · &ldquo;{SCHOOL_INFO.mottoTransliteration}&rdquo;
        </div>
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic border-l-4 border-[#0875C9] pl-4 bg-[#EAF6FF] py-3 rounded-r-xl">
          &ldquo;{SCHOOL_INFO.mottoExplanation}&rdquo;
        </p>
      </section>

      {/* ─── 3. Mission & Vision (Full Live Site Texts) ────────────────── */}
      <section id="mission" className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#FFFFFF] border border-[#D8EAF8] p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] border border-[#D8EAF8] flex items-center justify-center text-2xl mb-4 text-[#0875C9]">
            🎯
          </div>
          <h3 className="text-xl font-serif font-bold text-[#092F78] mb-3">
            Our Mission
          </h3>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
            We, the <strong>&ldquo;Saintsians&rdquo;</strong>, are dedicated to the execution and fostering of love, justice, and service imparted by Jesus Christ; provision of equal opportunity, promotion of gender equality, preservation of the integrity of creation, religious tolerance, national integration; empowerment of women and the marginalized; direct involvement in the integral development of society; combating the evils of discrimination, corruption, violence, communalism, and substance abuse; and generation and dissemination of true and up-to-date knowledge that leads to wisdom.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8EAF8] p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] border border-[#D8EAF8] flex items-center justify-center text-2xl mb-4 text-[#0875C9]">
            👁️
          </div>
          <h3 className="text-xl font-serif font-bold text-[#092F78] mb-3">
            Our Vision
          </h3>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
            To be a luminous seat of learning where education nurtures thinkers and creators rather than passive consumers. Envisioning our every student to dynamically and productively partake in fashioning the universe ever fresh, accomplishing the divinely assigned human task with dignity, discipline, and technological prowess.
          </p>
        </div>
      </section>

      {/* ─── 4. Management Team (Large Stately Portraits) ──────────────── */}
      <section id="management" className="mb-12">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8EAF8] mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#092F78]">
              Our Patrons &amp; Governing Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
              Guiding All Saints Public School with apostolic wisdom, academic vision, and pastoral care.
            </p>
          </div>
          <Link
            href="/about/our-management"
            className="text-xs font-bold text-[#0875C9] hover:text-[#092F78] hidden sm:flex items-center gap-1"
          >
            <span>Full Management Details</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Dual Patron Featured Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patron */}
          <div className="bg-white border-2 border-[#D8EAF8] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-64 sm:w-52 sm:h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-[#0875C9]/20 bg-slate-100">
              <Image
                src="/images/management/patron.jpg"
                alt="His Excellency Most Rev. Dr. Samuel Mar Irenios"
                fill
                className="object-cover object-top"
                sizes="220px"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block bg-[#0875C9] text-white text-[11px] font-serif font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-2">
                Patron &amp; President
              </span>
              <h3 className="font-serif font-bold text-lg text-[#092F78] mb-1">
                His Excellency Most Rev. Dr. Samuel Mar Irenios
              </h3>
              <p className="text-xs font-semibold text-[#FFB900] mb-3">
                Bishop of Pathanamthitta Diocese
              </p>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                President, The Malankara Catholic Educational Society of the Diocese of Pathanamthitta. Guiding our institutional trajectory with faith and visionary educational policy.
              </p>
            </div>
          </div>

          {/* Former Patron */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-64 sm:w-52 sm:h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 bg-slate-100">
              <Image
                src="/images/management/former-patron.jpg"
                alt="His Excellency Most Rev. Yoohanon Mar Chrysostom"
                fill
                className="object-cover object-top"
                sizes="220px"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block bg-[#092F78] text-white text-[11px] font-serif font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-2">
                Former Patron
              </span>
              <h3 className="font-serif font-bold text-lg text-[#092F78] mb-1">
                His Excellency Most Rev. Yoohanon Mar Chrysostom
              </h3>
              <p className="text-xs font-semibold text-slate-600 mb-3">
                Bishop Emeritus
              </p>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Fostered academic rigor and infrastructural expansion, providing steadfast pastoral guidance throughout foundational decades.
              </p>
            </div>
          </div>
        </div>

        {/* Principal, Director & Leadership Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs hover:border-[#0875C9] transition-all">
            <div className="relative w-36 h-44 mx-auto rounded-xl overflow-hidden shadow-sm border border-[#0875C9]/20 mb-3 bg-slate-100">
              <Image
                src="/images/management/principal.jpg"
                alt="Rev. Dr. James Stephen Olikal"
                fill
                className="object-cover object-top"
                sizes="150px"
              />
            </div>
            <span className="inline-block bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
              Principal
            </span>
            <h4 className="font-serif font-bold text-base text-[#092F78] mb-1">
              Rev. Dr. James Stephen Olikal
            </h4>
            <p className="text-xs text-[#FFB900] font-semibold mb-2">MA, Ph.D · Head of Institution</p>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Leading pedagogical innovation, academic mentorship, and holistic student development.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs hover:border-[#0875C9] transition-all">
            <div className="relative w-36 h-44 mx-auto rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-3 bg-slate-100">
              <Image
                src="/images/management/director.jpg"
                alt="Fr. Philipose Charivupurayidathil (Jobin C Kurian)"
                fill
                className="object-cover object-top"
                sizes="150px"
              />
            </div>
            <span className="inline-block bg-[#EAF6FF] text-[#0875C9] border border-[#D8EAF8] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
              Director
            </span>
            <h4 className="font-serif font-bold text-base text-[#092F78] mb-1">
              Fr. Philipose Charivupurayidathil
            </h4>
            <p className="text-xs text-[#FFB900] font-semibold mb-2">Jobin C Kurian · Administration</p>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Supervising infrastructure, campus facilities, conveyance operations, and student welfare.
            </p>
          </div>

          <div className="bg-[#F4FAFF] border border-[#D8EAF8] rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0875C9] text-white flex items-center justify-center text-xl mb-3 shadow-xs">
                🏛️
              </div>
              <span className="inline-block bg-[#FFF9E6] text-[#996F00] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 border border-[#FFB900]/30">
                Founder Manager
              </span>
              <h4 className="font-serif font-bold text-base text-[#092F78] mb-1">
                Rev. Fr. Thomas Kumbakattil
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-3">
                Founded All Saints Public School in June 2002 under the blessings of Moran Mor Cyril Baselios Catholicose.
              </p>
            </div>
            <div className="pt-3 border-t border-[#D8EAF8]">
              <Link
                href="/about/our-management"
                className="text-xs font-bold text-[#0875C9] hover:text-[#0066B5]"
              >
                View Full Management Board &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Bottom Navigation CTAs ─────────────────────────────────── */}
      <div className="bg-[#EAF6FF] border border-[#D8EAF8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#092F78]">
            Experience All Saints Public School
          </h3>
          <p className="text-xs text-slate-600 font-sans">
            Explore our CBSE academic curricula, 10-acre campus facilities, or contact our admissions desk.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/academics"
            className="bg-[#0875C9] hover:bg-[#0066B5] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Academic Programs
          </Link>
          <Link
            href="/admissions/enquiry"
            className="bg-white hover:bg-[#F4FAFF] text-[#0875C9] border border-[#0875C9] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Admission Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
